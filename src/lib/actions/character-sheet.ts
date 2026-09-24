"use server";

import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/db";
import { requireOwnedCharacter } from "@/lib/dal";
import {
  recomputeDomains,
  fromJson,
  toJsonInput,
  type CreationChoices,
} from "@/lib/character-domains";
import { HEALTH_TOTAL_BOXES } from "@/lib/health";
import { ADVANTAGES, type AdvantageKey } from "@/lib/game-data/advantages";
import { DOMAINS, type DomainKey } from "@/lib/game-data/domains";
import type { Selection } from "@/lib/game-data/stat-modifiers";
import { sanitizeText } from "@/lib/sanitize-text";

// Edição pós-criação da ficha completa (Fase 2). Diferente das ações do
// assistente (src/lib/actions/character.ts), estas não avançam etapa nem
// redirecionam — só atualizam e revalidam a própria página da ficha.

async function afterEdit(characterId: string) {
  revalidatePath(`/ficha/${characterId}`);
  refresh();
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

// --- Informações básicas (nome, descrições) ---
export async function updateBasicInfoAction(characterId: string, formData: FormData) {
  const character = await requireOwnedCharacter(characterId);
  const name = formData.get("name");
  const personality = formData.get("personality");
  const background = formData.get("background");
  const description = formData.get("description");
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      name:
        typeof name === "string" && name.trim() ? sanitizeText(name.trim()) : character.name,
      personality: typeof personality === "string" ? sanitizeText(personality) : null,
      background: typeof background === "string" ? sanitizeText(background) : null,
      description: typeof description === "string" ? sanitizeText(description) : null,
    },
  });
  await afterEdit(character.id);
}

// --- Arco Narrativo ---
export async function updateStoryArcAction(characterId: string, formData: FormData) {
  const character = await requireOwnedCharacter(characterId);
  const quest = formData.get("quest");
  const act1 = formData.get("act1");
  const act2 = formData.get("act2");
  const act3 = formData.get("act3");
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      storyArc: {
        quest: typeof quest === "string" ? sanitizeText(quest) : "",
        acts: [
          typeof act1 === "string" ? sanitizeText(act1) : "",
          typeof act2 === "string" ? sanitizeText(act2) : "",
          typeof act3 === "string" ? sanitizeText(act3) : "",
        ],
      },
    },
  });
  await afterEdit(character.id);
}

// --- Condição de Saúde (p.272-279) — marca/desmarca caixas de dano. ---
export async function adjustHealthAction(characterId: string, delta: number) {
  const character = await requireOwnedCharacter(characterId);
  const next = clamp(character.healthBoxesChecked + delta, 0, HEALTH_TOTAL_BOXES);
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { healthBoxesChecked: next },
  });
  await afterEdit(character.id);
}

// --- Pontos de Sobrevivência (p.203) — gasta/recupera do total já calculado. ---
export async function adjustSurvivalPointsAction(characterId: string, delta: number) {
  const character = await requireOwnedCharacter(characterId);
  const current = character.survivalPointsCurrent ?? character.survivalPoints;
  const next = clamp(current + delta, 0, character.survivalPoints);
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { survivalPointsCurrent: next },
  });
  await afterEdit(character.id);
}

// --- Pontos de Magia (p.203, 337) ---
export async function adjustMagicPointsAction(characterId: string, delta: number) {
  const character = await requireOwnedCharacter(characterId);
  const current = character.magicPointsCurrent ?? character.magicPoints;
  const next = clamp(current + delta, 0, character.magicPoints);
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { magicPointsCurrent: next },
  });
  await afterEdit(character.id);
}

export async function updateMagicInfoAction(characterId: string, formData: FormData) {
  const character = await requireOwnedCharacter(characterId);
  const form = formData.get("magicForm");
  const boon = formData.get("magicBoon");
  const familiar = formData.get("magicFamiliar");
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      magicForm: typeof form === "string" ? sanitizeText(form) : null,
      magicBoon: typeof boon === "string" ? sanitizeText(boon) : null,
      magicFamiliar: typeof familiar === "string" ? sanitizeText(familiar) : null,
    },
  });
  await afterEdit(character.id);
}

// --- Torment / Rout (p.287-289) — só um de cada por vez. ---
export async function setTormentAction(characterId: string, name: string | null) {
  const character = await requireOwnedCharacter(characterId);
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { torment: name },
  });
  await afterEdit(character.id);
}

export async function setRoutAction(characterId: string, name: string | null) {
  const character = await requireOwnedCharacter(characterId);
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { rout: name },
  });
  await afterEdit(character.id);
}

// --- Riquezas (ajuste manual — compras/saques durante o jogo) ---
export async function adjustRichesAction(characterId: string, delta: number) {
  const character = await requireOwnedCharacter(characterId);
  const next = Math.max(0, character.riches + delta);
  await prisma.characterSheet.update({
    where: { id: character.id },
    data: { riches: next },
  });
  await afterEdit(character.id);
}

// --- Disciplinas (p.171) — até 3 por Domínio na ficha oficial. ---
export async function addDisciplineAction(
  characterId: string,
  domainKey: string,
  name: string,
  rating: number,
) {
  const character = await requireOwnedCharacter(characterId);
  const domain = await prisma.characterDomain.findUnique({
    where: { characterId_domainKey: { characterId: character.id, domainKey } },
  });
  if (!domain || !name.trim()) return;
  const disciplines = fromJson<{ name: string; rating: number }[]>(domain.disciplines, []);
  if (disciplines.length >= 3) return;
  disciplines.push({ name: sanitizeText(name.trim()), rating: clamp(rating, 1, 10) });
  await prisma.characterDomain.update({
    where: { id: domain.id },
    data: { disciplines },
  });
  await afterEdit(character.id);
}

export async function removeDisciplineAction(
  characterId: string,
  domainKey: string,
  index: number,
) {
  const character = await requireOwnedCharacter(characterId);
  const domain = await prisma.characterDomain.findUnique({
    where: { characterId_domainKey: { characterId: character.id, domainKey } },
  });
  if (!domain) return;
  const disciplines = fromJson<{ name: string; rating: number }[]>(domain.disciplines, []);
  if (!Number.isInteger(index) || index < 0 || index >= disciplines.length) return;
  disciplines.splice(index, 1);
  await prisma.characterDomain.update({
    where: { id: domain.id },
    data: { disciplines },
  });
  await afterEdit(character.id);
}

// --- Comprar Vantagem depois da criação (p.189: "podem ser adquiridas no
// curso do jogo gastando os pontos de Experiência necessários") ---
export async function buyAdvantageAction(characterId: string, advantageKey: string) {
  const character = await requireOwnedCharacter(characterId);
  const def = ADVANTAGES.find((a) => a.key === advantageKey);
  if (!def || def.creationOnly) return; // Vantagens com * só na criação (p.189)

  const current = fromJson<Selection<AdvantageKey>[]>(character.advantages, []);
  const already = current.find((a) => a.key === advantageKey);
  if (already && already.times >= def.maxTimes) return;
  const cost = already ? (def.repeatCost ?? def.cost) : def.cost;
  if (character.experience < cost) return;

  const next = already
    ? current.map((a) => (a.key === advantageKey ? { ...a, times: a.times + 1 } : a))
    : [...current, { key: advantageKey as AdvantageKey, times: 1 }];

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      advantages: toJsonInput(next),
      experience: character.experience - cost,
    },
  });
  await afterEdit(character.id);
}

// --- Melhorar um Domínio gastando XP depois da criação (p.193, 10 XP/nível) ---
export async function spendXpOnDomainAction(characterId: string, domainKey: string) {
  const character = await requireOwnedCharacter(characterId);
  if (!DOMAINS.some((d) => d.key === domainKey)) return;
  if (character.experience < 10) return;

  const choices = fromJson<CreationChoices>(character.creationChoices, {});
  const spends = choices.domainXpSpends ?? [];
  const existing = spends.find((s) => s.domainKey === domainKey);
  if (existing) existing.levels += 1;
  else spends.push({ domainKey: domainKey as DomainKey, levels: 1 });
  choices.domainXpSpends = spends;

  await prisma.characterSheet.update({
    where: { id: character.id },
    data: {
      experience: character.experience - 10,
      creationChoices: toJsonInput(choices),
    },
  });
  await recomputeDomains(character.id);
  await afterEdit(character.id);
}
