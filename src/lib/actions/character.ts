"use server";

import { redirect } from "next/navigation";
import { refresh, revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, requireOwnedCharacter } from "@/lib/dal";
import {
  recomputeDomains,
  toJsonInput,
  fromJson,
  type CreationChoices,
} from "@/lib/character-domains";
import { COLORS } from "@/lib/game-data/colors";
import { ORIGINS } from "@/lib/game-data/origins";
import { DOMAINS, domainsForWay, type DomainKey } from "@/lib/game-data/domains";
import { OCCUPATIONS } from "@/lib/game-data/occupations";
import { getAgeBand } from "@/lib/game-data/age";
import {
  DISADVANTAGES,
  type DisadvantageKey,
} from "@/lib/game-data/disadvantages";
import { ADVANTAGES, type AdvantageKey } from "@/lib/game-data/advantages";
import {
  computeDefense,
  computeMentalResistance,
  computePotential,
  computeSpeed,
  BASE_STAMINA,
  BASE_SURVIVAL_POINTS,
} from "@/lib/character-calc";
import { sumStatDeltas, type Selection } from "@/lib/game-data/stat-modifiers";
import type { Way } from "@/generated/prisma/enums";

export type StepFormState = { message?: string } | undefined;

// Cria uma nova ficha em rascunho e vai para a Etapa 1.
export async function createCharacterAction() {
  const user = await requireUser();
  const character = await prisma.characterSheet.create({
    data: { userId: user.userId },
  });
  redirect(`/ficha/${character.id}/etapa/1`);
}

async function advanceStep(characterId: string, step: number) {
  const character = await prisma.characterSheet.findUniqueOrThrow({
    where: { id: characterId },
  });
  if (character.creationStep < step) {
    await prisma.characterSheet.update({
      where: { id: characterId },
      data: { creationStep: step },
    });
  }
  // O layout do assistente (barra de progresso no topo) fica em cache no
  // roteador do Next.js entre as etapas — sem isso, ele continua mostrando
  // o progresso de quando a página carregou a primeira vez, mesmo depois
  // de salvar uma etapa. Precisa invalidar explicitamente o "layout", não
  // só a "page".
  revalidatePath(`/ficha/${characterId}/etapa`, "layout");
}

// --- Etapa 1: Color (p.161) ---
export async function saveColorAction(
  characterId: string,
  _prev: StepFormState,
  formData: FormData,
): Promise<StepFormState> {
  const character = await requireOwnedCharacter(characterId);
  const color = formData.get("color");
  if (typeof color !== "string" || !COLORS.some((c) => c.key === color)) {
    return { message: "Escolha uma Cor." };
  }
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { color },
  });
  await advanceStep(character.id, 1);
  redirect(`/ficha/${character.id}/etapa/2`);
}

// --- Etapa 2: Origin (p.165-167) ---
export async function saveOriginAction(
  characterId: string,
  _prev: StepFormState,
  formData: FormData,
): Promise<StepFormState> {
  const character = await requireOwnedCharacter(characterId);
  const origin = formData.get("origin");
  const bonusDomain = formData.get("bonusDomain");
  const originDef = ORIGINS.find((o) => o.key === origin);
  if (!originDef) return { message: "Escolha uma Origem." };
  const validDomains = domainsForWay(originDef.bonusWay).map((d) => d.key);
  if (typeof bonusDomain !== "string" || !validDomains.includes(bonusDomain as DomainKey)) {
    return { message: "Escolha um Domínio válido para o bônus da Origem." };
  }

  const choices = fromJson<CreationChoices>(character.creationChoices, {});
  choices.originBonusDomain = bonusDomain as DomainKey;

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { origin: originDef.key, creationChoices: toJsonInput(choices) },
  });
  await recomputeDomains(character.id);
  await advanceStep(character.id, 2);
  redirect(`/ficha/${character.id}/etapa/3`);
}

// --- Etapa 3: Ways (p.169) --- distribuir 1,2,3,4,5 sem repetir.
export async function saveWaysAction(
  characterId: string,
  _prev: StepFormState,
  formData: FormData,
): Promise<StepFormState> {
  const character = await requireOwnedCharacter(characterId);
  const keys: Way[] = ["AWARENESS", "COMBATIVENESS", "CONVICTION", "CREATIVITY", "REASON"];
  const values: number[] = [];
  for (const key of keys) {
    const raw = formData.get(key);
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      return { message: "Cada Via precisa de um valor entre 1 e 5." };
    }
    values.push(n);
  }
  const sorted = [...values].sort();
  if (sorted.join(",") !== "1,2,3,4,5") {
    return { message: "Distribua 1, 2, 3, 4 e 5 entre as Vias, sem repetir nenhum valor." };
  }

  await prisma.$transaction(
    keys.map((key, i) =>
      prisma.characterWay.upsert({
        where: { characterId_way: { characterId: character.id, way: key } },
        create: { characterId: character.id, way: key, rating: values[i] },
        update: { rating: values[i] },
      }),
    ),
  );
  await advanceStep(character.id, 3);
  redirect(`/ficha/${character.id}/etapa/4`);
}

// --- Etapa 4: Occupation and Skills (p.173-179) ---
export async function saveOccupationAction(
  characterId: string,
  _prev: StepFormState,
  formData: FormData,
): Promise<StepFormState> {
  const character = await requireOwnedCharacter(characterId);
  const occupationKey = formData.get("occupation");
  const occ = OCCUPATIONS.find((o) => o.key === occupationKey);
  if (!occ) return { message: "Escolha uma Ocupação." };

  const secondary = formData.get("secondary");
  const tertiary = formData.get("tertiary");
  if (typeof secondary !== "string" || !occ.secondaryOptions.includes(secondary as DomainKey)) {
    return { message: "Escolha um Domínio Secundário válido para essa Ocupação." };
  }
  if (typeof tertiary !== "string" || !occ.tertiaryOptions.includes(tertiary as DomainKey)) {
    return { message: "Escolha um Domínio Terciário válido para essa Ocupação." };
  }

  const touched = new Set([occ.primary, secondary, tertiary]);
  // Um seletor por Domínio (Nenhum/+1/+2) em vez de 4 combos separados —
  // assim é impossível escolher o mesmo Domínio duas vezes ou um Domínio
  // já tocado pela Ocupação, e a UI sempre mostra o que já está escolhido.
  const plus2: DomainKey[] = [];
  const plus1: DomainKey[] = [];
  for (const domain of DOMAINS) {
    if (touched.has(domain.key)) continue;
    const level = formData.get(`pursuit_${domain.key}`);
    if (level === "2") plus2.push(domain.key);
    else if (level === "1") plus1.push(domain.key);
  }
  if (plus2.length !== 2 || plus1.length !== 2) {
    return {
      message: `Escolha exatamente 2 Domínios para +2 (selecionou ${plus2.length}) e 2 para +1 (selecionou ${plus1.length}).`,
    };
  }

  const choices = fromJson<CreationChoices>(character.creationChoices, {});
  choices.occupation = { secondary: secondary as DomainKey, tertiary: tertiary as DomainKey };
  choices.otherPursuits = { plus2, plus1 };

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { occupation: occ.key, creationChoices: toJsonInput(choices) },
  });
  await recomputeDomains(character.id);
  await advanceStep(character.id, 4);
  redirect(`/ficha/${character.id}/etapa/5`);
}

// --- Etapa 5: Age (p.181) ---
export async function saveAgeAction(
  characterId: string,
  _prev: StepFormState,
  formData: FormData,
): Promise<StepFormState> {
  const character = await requireOwnedCharacter(characterId);
  const age = Number(formData.get("age"));
  if (!Number.isInteger(age) || age < 15) {
    return { message: "A idade mínima é 15 anos." };
  }
  const band = getAgeBand(age);

  const bonusDomains: DomainKey[] = [];
  for (let i = 0; i < band.domainBonusCount; i++) {
    const d = formData.get(`ageBonus_${i}`);
    if (typeof d !== "string" || !d) {
      return { message: `Escolha ${band.domainBonusCount} Domínio(s) para o bônus de idade.` };
    }
    bonusDomains.push(d as DomainKey);
  }
  if (new Set(bonusDomains).size !== bonusDomains.length) {
    return { message: "Os Domínios do bônus de idade precisam ser diferentes entre si." };
  }

  const ageDisadvantages: Selection<DisadvantageKey>[] = [];
  if (band.disadvantagePoints > 0) {
    for (const def of DISADVANTAGES) {
      const checked = formData.get(`ageDis_${def.key}`);
      if (checked === "on") {
        const times = def.maxTimes === 2 && formData.get(`ageDis_${def.key}_2x`) === "on" ? 2 : 1;
        ageDisadvantages.push({ key: def.key, times });
      }
    }
    const total = ageDisadvantages.reduce((sum, sel) => {
      const def = DISADVANTAGES.find((d) => d.key === sel.key)!;
      return sum + def.cost + (sel.times > 1 ? def.repeatCost ?? 0 : 0);
    }, 0);
    if (total !== band.disadvantagePoints) {
      return {
        message: `As Desvantagens de idade escolhidas somam ${total} pontos; precisam somar exatamente ${band.disadvantagePoints} (p.181).`,
      };
    }
  }

  const choices = fromJson<CreationChoices>(character.creationChoices, {});
  choices.ageBonusDomains = bonusDomains;
  choices.ageDisadvantages = ageDisadvantages;

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { age, creationChoices: toJsonInput(choices) },
  });
  await recomputeDomains(character.id);
  await advanceStep(character.id, 5);
  redirect(`/ficha/${character.id}/etapa/6`);
}

// --- Etapa 6: Experience, Advantages, and Disadvantages (p.183-193) ---
export async function saveExperienceAction(
  characterId: string,
  _prev: StepFormState,
  formData: FormData,
): Promise<StepFormState> {
  const character = await requireOwnedCharacter(characterId);

  const disadvantages: Selection<DisadvantageKey>[] = [];
  for (const def of DISADVANTAGES) {
    const checked = formData.get(`dis_${def.key}`);
    if (checked === "on") {
      const times = def.maxTimes === 2 && formData.get(`dis_${def.key}_2x`) === "on" ? 2 : 1;
      disadvantages.push({ key: def.key, times });
    }
  }
  if (disadvantages.length > 5) {
    return { message: "No máximo 5 Desvantagens (p.183)." };
  }

  const advantages: Selection<AdvantageKey>[] = [];
  for (const def of ADVANTAGES) {
    const checked = formData.get(`adv_${def.key}`);
    if (checked === "on") {
      const times = def.maxTimes === 2 && formData.get(`adv_${def.key}_2x`) === "on" ? 2 : 1;
      advantages.push({ key: def.key, times });
    }
  }

  const bonusFromCreationOfAvalon = Number(formData.get("bonusXp") ?? 0) || 0;

  const disCost = disadvantages.reduce((sum, sel) => {
    const def = DISADVANTAGES.find((d) => d.key === sel.key)!;
    return sum + def.cost + (sel.times > 1 ? def.repeatCost ?? 0 : 0);
  }, 0);
  const advCost = advantages.reduce((sum, sel) => {
    const def = ADVANTAGES.find((d) => d.key === sel.key)!;
    return sum + def.cost + (sel.times > 1 ? def.repeatCost ?? 0 : 0);
  }, 0);

  const domainXpSpends: { domainKey: DomainKey; levels: number }[] = [];
  let domainXpCost = 0;
  for (const domain of DOMAINS) {
    const levels = Number(formData.get(`dspend_${domain.key}`) ?? 0);
    if (levels > 0) {
      domainXpSpends.push({ domainKey: domain.key, levels });
      domainXpCost += levels * 10;
    }
  }

  const pool = bonusFromCreationOfAvalon + disCost;
  const spent = advCost + domainXpCost;
  if (spent > pool) {
    return {
      message: `Experiência insuficiente: pool de ${pool} XP, gasto de ${spent} XP.`,
    };
  }

  const choices = fromJson<CreationChoices>(character.creationChoices, {});
  choices.domainXpSpends = domainXpSpends;
  choices.bonusXp = bonusFromCreationOfAvalon;

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      disadvantages: toJsonInput(disadvantages),
      advantages: toJsonInput(advantages),
      experience: pool - spent,
      creationChoices: toJsonInput(choices),
    },
  });
  await recomputeDomains(character.id);
  await advanceStep(character.id, 6);
  redirect(`/ficha/${character.id}/etapa/7`);
}

// --- Etapa 7: Equipment (p.194) ---
export async function addEquipmentItemAction(
  characterId: string,
  itemKey: string,
  cost: number,
  type: "WEAPON" | "ARMOR" | "EQUIPMENT",
  name: string,
) {
  const character = await requireOwnedCharacter(characterId);
  if (character.riches < cost) return;
  await prisma.$transaction([
    prisma.characterSheet.update({
      where: { id: character.id },
      data: { riches: { decrement: cost } },
    }),
    prisma.characterItem.create({
      data: { characterId: character.id, type, name, stats: { key: itemKey, cost } },
    }),
  ]);
  refresh();
}

export async function removeEquipmentItemAction(characterId: string, itemId: string) {
  const character = await requireOwnedCharacter(characterId);
  const item = await prisma.characterItem.findUnique({ where: { id: itemId } });
  if (!item || item.characterId !== character.id) return;
  const cost = (item.stats as { cost?: number } | null)?.cost ?? 0;
  await prisma.$transaction([
    prisma.characterItem.delete({ where: { id: itemId } }),
    prisma.characterSheet.update({
      where: { id: character.id },
      data: { riches: { increment: cost } },
    }),
  ]);
  refresh();
}

export async function confirmEquipmentStepAction(characterId: string) {
  const character = await requireOwnedCharacter(characterId);
  const hasTravelGear = await prisma.characterItem.findFirst({
    where: { characterId: character.id, name: "Equipamento de Viagem" },
  });
  if (!hasTravelGear) {
    await prisma.characterItem.create({
      data: {
        characterId: character.id,
        type: "EQUIPMENT",
        name: "Equipamento de Viagem",
        stats: { key: "TRAVEL_GEAR", cost: 0, free: true },
      },
    });
  }
  await advanceStep(character.id, 7);
  redirect(`/ficha/${character.id}/etapa/8`);
}

// --- Etapa 8: Character Description (p.195-199) ---
export async function saveDescriptionAction(
  characterId: string,
  _prev: StepFormState,
  formData: FormData,
): Promise<StepFormState> {
  const character = await requireOwnedCharacter(characterId);
  const name = formData.get("name");
  const qualityWay = formData.get("qualityWay");
  const qualityWord = formData.get("qualityWord");
  const flawWay = formData.get("flawWay");
  const flawWord = formData.get("flawWord");
  const personality = formData.get("personality");
  const background = formData.get("background");
  const description = formData.get("description");

  if (typeof name !== "string" || !name.trim()) {
    return { message: "Dê um nome ao personagem." };
  }
  if (
    typeof qualityWay !== "string" ||
    typeof qualityWord !== "string" ||
    !qualityWord.trim() ||
    typeof flawWay !== "string" ||
    typeof flawWord !== "string" ||
    !flawWord.trim()
  ) {
    return { message: "Escolha uma Qualidade e um Defeito." };
  }

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      name: name.trim(),
      traits: {
        quality: { way: qualityWay, word: qualityWord },
        flaw: { way: flawWay, word: flawWord },
      },
      personality: typeof personality === "string" ? personality : null,
      background: typeof background === "string" ? background : null,
      description: typeof description === "string" ? description : null,
    },
  });
  await advanceStep(character.id, 8);
  redirect(`/ficha/${character.id}/etapa/9`);
}

// --- Etapa 9: Other Attributes (p.201-203) — tudo calculado, só confirma. ---
export async function confirmAttributesAction(characterId: string) {
  const character = await requireOwnedCharacter(characterId);
  const ways = await prisma.characterWay.findMany({ where: { characterId: character.id } });
  const rating = (way: Way) => ways.find((w) => w.way === way)?.rating ?? 0;

  const potential = computePotential(rating("CREATIVITY"));
  const defense = computeDefense(rating("AWARENESS"), rating("REASON"));
  const speed = computeSpeed(rating("AWARENESS"), rating("COMBATIVENESS"));
  const mentalResistance = computeMentalResistance(rating("CONVICTION"));

  const delta = sumStatDeltas(
    fromJson<Selection<AdvantageKey>[]>(character.advantages, []),
    fromJson<Selection<DisadvantageKey>[]>(character.disadvantages, []),
  );

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      potential,
      defense: defense + (delta.defense ?? 0),
      speed: speed + (delta.speed ?? 0),
      stamina: BASE_STAMINA + (delta.stamina ?? 0),
      mentalResistance: mentalResistance + (delta.mentalResistance ?? 0),
      survivalPoints: BASE_SURVIVAL_POINTS + (delta.survivalPoints ?? 0),
    },
  });
  await advanceStep(character.id, 9);
  redirect(`/ficha/${character.id}/etapa/10`);
}

// --- Etapa 10: Story Arc (p.205-207) ---
export async function saveStoryArcAction(
  characterId: string,
  _prev: StepFormState,
  formData: FormData,
): Promise<StepFormState> {
  const character = await requireOwnedCharacter(characterId);
  const quest = formData.get("quest");
  const act1 = formData.get("act1");
  const act2 = formData.get("act2");
  const act3 = formData.get("act3");

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      storyArc: {
        quest: typeof quest === "string" ? quest : "",
        acts: [
          typeof act1 === "string" ? act1 : "",
          typeof act2 === "string" ? act2 : "",
          typeof act3 === "string" ? act3 : "",
        ],
      },
    },
  });
  await advanceStep(character.id, 10);
  redirect(`/ficha/${character.id}/etapa/final`);
}

// --- Etapa Final: Discussion Among Players (p.209) ---
export async function finalizeCharacterAction(characterId: string) {
  const character = await requireOwnedCharacter(characterId);
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { status: "COMPLETE" },
  });
  redirect(`/ficha/${character.id}`);
}
