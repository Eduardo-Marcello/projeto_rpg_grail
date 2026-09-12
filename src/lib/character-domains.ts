import "server-only";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import type { DomainKey } from "@/lib/game-data/domains";
import { getOrigin, type OriginKey } from "@/lib/game-data/origins";
import { getOccupation, type OccupationKey } from "@/lib/game-data/occupations";

// Os campos Json do Prisma (CreationChoices, listas de Vantagens e
// Desvantagens escolhidas etc.) não batem estruturalmente com nossos tipos
// TypeScript específicos — helpers para converter nos dois sentidos sem
// espalhar "as unknown as X" pelo código.
export function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

export function fromJson<T>(value: unknown, fallback: T): T {
  return (value ?? fallback) as unknown as T;
}

// creationChoices: a "bolsa" de metadados de criação guardada em
// CharacterSheet.creationChoices (ver comentário no schema.prisma).
export interface CreationChoices {
  originBonusDomain?: DomainKey;
  occupation?: { secondary: DomainKey; tertiary: DomainKey };
  otherPursuits?: { plus2: DomainKey[]; plus1: DomainKey[] };
  ageBonusDomains?: DomainKey[];
  ageDisadvantages?: { key: string; times: number }[];
  domainXpSpends?: { domainKey: DomainKey; levels: number }[];
  bonusXp?: number;
}

// Recalcula do zero os pontos "estruturais" de cada Domínio (Origem +
// Ocupação + Other Pursuits + Idade + XP investido), a partir das escolhas
// guardadas na ficha. Roda de novo a cada vez que uma dessas etapas é
// salva, para que editar uma etapa anterior não deixe pontos "fantasmas"
// de uma escolha antiga. Disciplinas (Fase 2) são preservadas.
//
// Fontes: p.165-167 (Origem), p.173-178 (Ocupação), p.181 (Idade),
// p.193 (gastar XP em Domínio).
export async function recomputeDomains(characterId: string): Promise<void> {
  const character = await prisma.characterSheet.findUniqueOrThrow({
    where: { id: characterId },
  });
  const choices = fromJson<CreationChoices>(character.creationChoices, {});

  const totals = new Map<DomainKey, number>();
  const add = (key: DomainKey, amount: number) => {
    totals.set(key, (totals.get(key) ?? 0) + amount);
  };

  if (character.origin && choices.originBonusDomain) {
    add(choices.originBonusDomain, 1);
  }

  if (character.occupation && choices.occupation) {
    const occ = getOccupation(character.occupation as OccupationKey);
    add(occ.primary, 5);
    add(choices.occupation.secondary, 3);
    add(choices.occupation.tertiary, 1);
  }

  if (choices.otherPursuits) {
    for (const d of choices.otherPursuits.plus2 ?? []) add(d, 2);
    for (const d of choices.otherPursuits.plus1 ?? []) add(d, 1);
  }

  if (character.age && choices.ageBonusDomains) {
    for (const d of choices.ageBonusDomains) add(d, 1);
  }

  for (const spend of choices.domainXpSpends ?? []) {
    add(spend.domainKey, spend.levels);
  }

  const existing = await prisma.characterDomain.findMany({
    where: { characterId },
  });
  const disciplinesByKey = new Map(
    existing.map((row) => [row.domainKey, row.disciplines]),
  );

  await prisma.$transaction([
    prisma.characterDomain.deleteMany({ where: { characterId } }),
    ...Array.from(totals.entries())
      .filter(([, rating]) => rating > 0)
      .map(([domainKey, rating]) =>
        prisma.characterDomain.create({
          data: {
            characterId,
            domainKey,
            rating,
            disciplines: disciplinesByKey.get(domainKey) ?? undefined,
          },
        }),
      ),
  ]);
}

// Domínios possíveis para bônus de Origem (mesma Via da Origem escolhida).
export function originBonusDomainOptions(originKey: OriginKey) {
  const origin = getOrigin(originKey);
  return origin.bonusWay;
}

export function ageDisadvantageTotal(
  selections: { key: string; times: number }[],
  disadvantageCosts: Record<string, { cost: number; repeatCost?: number }>,
): number {
  return selections.reduce((sum, sel) => {
    const def = disadvantageCosts[sel.key];
    if (!def) return sum;
    let total = def.cost;
    if (sel.times > 1 && def.repeatCost) total += def.repeatCost;
    return sum + total;
  }, 0);
}
