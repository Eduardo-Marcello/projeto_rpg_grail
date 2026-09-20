"use server";

import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/db";
import { requireOwnedCharacter } from "@/lib/dal";
import { fromJson } from "@/lib/character-domains";
import { getDomain, type DomainKey } from "@/lib/game-data/domains";
import { getWay } from "@/lib/game-data/ways";
import { getEquipmentItem } from "@/lib/game-data/equipment";
import { resolveTestRoll, resolveAttackRoll, type Stance } from "@/lib/dice";
import type { Way } from "@/generated/prisma/enums";

// Mesa de rolagem (Fase 4) — comandos /teste e /atacar, p.244-257 e p.264.
// Sempre recarrega Domínio/Via do banco em vez de confiar em valores vindos
// do formulário, para o resultado bater com a ficha salva.

function afterRoll() {
  revalidatePath("/mesa");
  refresh();
}

async function loadDomainAndWay(characterId: string, domainKey: DomainKey) {
  const domainDef = getDomain(domainKey);
  const wayDef = getWay(domainDef.way);
  const [domainRow, wayRow] = await Promise.all([
    prisma.characterDomain.findUnique({
      where: { characterId_domainKey: { characterId, domainKey } },
    }),
    prisma.characterWay.findUnique({
      where: { characterId_way: { characterId, way: domainDef.way as Way } },
    }),
  ]);
  return { domainDef, wayDef, domainRow, wayRow };
}

// --- /teste [tipo] ---
export async function rollTestAction(characterId: string, formData: FormData) {
  const character = await requireOwnedCharacter(characterId);
  const domainKey = String(formData.get("domainKey") ?? "") as DomainKey;
  const disciplineIndexRaw = formData.get("disciplineIndex");
  const thresholdRaw = formData.get("threshold");

  const { domainDef, wayDef, domainRow, wayRow } = await loadDomainAndWay(
    character.id,
    domainKey,
  );

  let skillLabel = domainDef.name;
  let skillRating = (domainRow?.rating ?? 0) + (domainRow?.bonus ?? 0) - (domainRow?.penalty ?? 0);

  const disciplineIndex =
    typeof disciplineIndexRaw === "string" && disciplineIndexRaw !== ""
      ? Number(disciplineIndexRaw)
      : null;
  if (disciplineIndex != null) {
    const disciplines = fromJson<{ name: string; rating: number }[]>(
      domainRow?.disciplines,
      [],
    );
    const discipline = disciplines[disciplineIndex];
    if (discipline) {
      skillLabel = discipline.name;
      skillRating = discipline.rating;
    }
  }

  const threshold =
    typeof thresholdRaw === "string" && thresholdRaw.trim() !== "" ? Number(thresholdRaw) : null;

  const roll = resolveTestRoll({
    skillLabel,
    skillRating,
    wayLabel: wayDef.name,
    wayRating: wayRow?.rating ?? 0,
    difficultyThreshold: threshold != null && Number.isFinite(threshold) ? threshold : null,
  });

  await prisma.diceRollLog.create({
    data: {
      characterId: character.id,
      command: `/teste ${skillLabel}`,
      breakdown: roll.breakdown,
      result: roll.total,
    },
  });
  afterRoll();
}

// --- /atacar ---
const COMBAT_DOMAIN_KEYS: DomainKey[] = ["CLOSE_COMBAT", "SHOOT_THROW", "MOUNTED_COMBAT"];

export async function rollAttackAction(characterId: string, formData: FormData) {
  const character = await requireOwnedCharacter(characterId);
  const domainKey = String(formData.get("domainKey") ?? "") as DomainKey;
  if (!COMBAT_DOMAIN_KEYS.includes(domainKey)) return;
  const disciplineIndexRaw = formData.get("disciplineIndex");
  const stanceRaw = String(formData.get("stance") ?? "STANDARD");
  const stance: Stance =
    stanceRaw === "OFFENSIVE" || stanceRaw === "DEFENSIVE" ? stanceRaw : "STANDARD";
  const itemId = formData.get("itemId");

  const { domainDef, wayDef, domainRow, wayRow } = await loadDomainAndWay(
    character.id,
    domainKey,
  );

  let skillLabel = domainDef.name;
  let skillRating = (domainRow?.rating ?? 0) + (domainRow?.bonus ?? 0) - (domainRow?.penalty ?? 0);
  const disciplineIndex =
    typeof disciplineIndexRaw === "string" && disciplineIndexRaw !== ""
      ? Number(disciplineIndexRaw)
      : null;
  if (disciplineIndex != null) {
    const disciplines = fromJson<{ name: string; rating: number }[]>(
      domainRow?.disciplines,
      [],
    );
    const discipline = disciplines[disciplineIndex];
    if (discipline) {
      skillLabel = discipline.name;
      skillRating = discipline.rating;
    }
  }

  let weaponLabel = "Desarmado";
  let weaponDamage = 0;
  if (typeof itemId === "string" && itemId) {
    const item = await prisma.characterItem.findFirst({
      where: { id: itemId, characterId: character.id, type: "WEAPON" },
    });
    const key = (item?.stats as { key?: string } | null)?.key;
    const def = key ? getEquipmentItem(key) : undefined;
    if (item && def?.damage != null) {
      weaponLabel = item.name;
      weaponDamage = def.damage;
    }
  }

  // As 3 Domínios de combate (CLOSE_COMBAT, SHOOT_THROW, MOUNTED_COMBAT) já
  // são associados à Via de Combatividade (domains.ts) — é sempre ela que
  // entra na fórmula de Ataque (p.264).
  const roll = resolveAttackRoll({
    combativenessLabel: wayDef.name,
    combativenessRating: wayRow?.rating ?? 0,
    skillLabel,
    skillRating,
    stance,
    potential: character.potential,
    weaponLabel,
    weaponDamage,
  });

  await prisma.diceRollLog.create({
    data: {
      characterId: character.id,
      command: `/atacar ${skillLabel}`,
      breakdown: roll.breakdown,
      result: roll.attackScore,
    },
  });
  afterRoll();
}
