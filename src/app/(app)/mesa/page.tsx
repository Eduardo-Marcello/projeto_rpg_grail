import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { fromJson } from "@/lib/character-domains";
import { DOMAINS, type DomainKey } from "@/lib/game-data/domains";
import { getWay } from "@/lib/game-data/ways";
import { getEquipmentItem } from "@/lib/game-data/equipment";
import { TestRollForm } from "@/components/dice/TestRollForm";
import { AttackRollForm } from "@/components/dice/AttackRollForm";
import { RollHistory } from "@/components/dice/RollHistory";
import { CharacterSelect } from "@/components/dice/CharacterSelect";

const COMBAT_DOMAIN_KEYS: DomainKey[] = ["CLOSE_COMBAT", "SHOOT_THROW", "MOUNTED_COMBAT"];

export default async function MesaPage({
  searchParams,
}: {
  searchParams: Promise<{ personagem?: string }>;
}) {
  const user = await requireUser();
  const { personagem } = await searchParams;

  const characters = await prisma.characterSheet.findMany({
    where: { userId: user.userId, status: "COMPLETE" },
    orderBy: { updatedAt: "desc" },
  });

  if (characters.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Mesa de Dados</h1>
        <p className="text-sm text-foreground/70">
          Termine de criar uma ficha para poder usar os comandos{" "}
          <code className="rounded bg-background px-1 py-0.5">/teste [tipo]</code> e{" "}
          <code className="rounded bg-background px-1 py-0.5">/atacar</code>.
        </p>
        <Link href="/ficha" className="text-sm text-accent">
          Ir para suas fichas
        </Link>
      </div>
    );
  }

  const character =
    characters.find((c) => c.id === personagem) ?? characters[0];

  const [domainRows, items, rolls] = await Promise.all([
    prisma.characterDomain.findMany({ where: { characterId: character.id } }),
    prisma.characterItem.findMany({
      where: { characterId: character.id, type: "WEAPON" },
    }),
    prisma.diceRollLog.findMany({
      where: { characterId: character.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const allDomainOptions = DOMAINS.map((d) => {
    const row = domainRows.find((r) => r.domainKey === d.key);
    return {
      key: d.key,
      name: d.name,
      wayName: getWay(d.way).name,
      rating: (row?.rating ?? 0) + (row?.bonus ?? 0) - (row?.penalty ?? 0),
      disciplines: fromJson<{ name: string; rating: number }[]>(row?.disciplines, []),
    };
  });

  const combatDomainOptions = allDomainOptions.filter((d) =>
    COMBAT_DOMAIN_KEYS.includes(d.key),
  );

  const weaponOptions = items
    .map((item) => {
      const key = (item.stats as { key?: string } | null)?.key;
      const def = key ? getEquipmentItem(key) : undefined;
      return def?.damage != null ? { id: item.id, name: item.name, damage: def.damage } : null;
    })
    .filter((w): w is { id: string; name: string; damage: number } => w != null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Mesa de Dados</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Resolução (Domínio/Disciplina + Via + 1D10, p.244-257) e Ataque
          (Combatividade + Domínio/Disciplina + Postura + 1D10, p.264), com
          crítico em 10 ou 1 natural confirmado por reteste.
        </p>
      </div>

      {characters.length > 1 && (
        <CharacterSelect characters={characters} selectedId={character.id} />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-border bg-surface p-4">
          <TestRollForm characterId={character.id} domains={allDomainOptions} />
        </div>
        <div className="rounded-md border border-border bg-surface p-4">
          <AttackRollForm
            characterId={character.id}
            combatDomains={combatDomainOptions}
            weapons={weaponOptions}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Histórico</h2>
        <RollHistory rolls={rolls} />
      </div>
    </div>
  );
}
