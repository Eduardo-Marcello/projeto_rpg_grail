import { redirect } from "next/navigation";
import { requireOwnedCharacter } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { getColor, type ColorKey } from "@/lib/game-data/colors";
import { getOrigin, type OriginKey } from "@/lib/game-data/origins";
import { getOccupation, type OccupationKey } from "@/lib/game-data/occupations";
import { getDomain, type DomainKey } from "@/lib/game-data/domains";
import { WAYS } from "@/lib/game-data/ways";
import { fromJson } from "@/lib/character-domains";

// Visualização simples da ficha completa. Uma versão visual mais fiel ao
// layout oficial (p.390-391), com edição e exportação em PDF, chega na
// Fase 2 — este é só o "pouso" natural depois do assistente de criação.
export default async function CharacterViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  if (character.status !== "COMPLETE") {
    redirect(`/ficha/${character.id}/etapa/${character.creationStep + 1}`);
  }

  const [ways, domains, items] = await Promise.all([
    prisma.characterWay.findMany({ where: { characterId: character.id } }),
    prisma.characterDomain.findMany({
      where: { characterId: character.id },
      orderBy: { rating: "desc" },
    }),
    prisma.characterItem.findMany({ where: { characterId: character.id } }),
  ]);

  const traits = fromJson<{ quality?: { word: string }; flaw?: { word: string } } | null>(
    character.traits,
    null,
  );
  const storyArc = fromJson<{ quest?: string; acts?: string[] } | null>(character.storyArc, null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{character.name}</h1>
        <p className="mt-1 text-sm text-foreground/70">
          {character.color && getColor(character.color as ColorKey).name} ·{" "}
          {character.origin && getOrigin(character.origin as OriginKey).name} ·{" "}
          {character.occupation && getOccupation(character.occupation as OccupationKey).name} ·{" "}
          {character.age} anos
        </p>
        {traits && (
          <p className="mt-1 text-sm text-foreground/70">
            Qualidade: {traits.quality?.word} · Defeito: {traits.flaw?.word}
          </p>
        )}
      </div>

      <section>
        <h2 className="text-lg font-semibold">Vias</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {WAYS.map((w) => (
            <span key={w.key} className="rounded-md border border-border bg-surface px-3 py-1">
              {w.name}: {ways.find((cw) => cw.way === w.key)?.rating ?? 0}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Domínios</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {domains.map((d) => (
            <span key={d.id} className="rounded-md border border-border bg-surface px-3 py-1">
              {getDomain(d.domainKey as DomainKey).name}: {d.rating}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Atributos</h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <span className="rounded-md border border-border bg-surface px-3 py-1">Potencial: {character.potential}</span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">Defesa: {character.defense}</span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">Velocidade: {character.speed}</span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">Vigor: {character.stamina}</span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">
            Resistência Mental: {character.mentalResistance}
          </span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">
            Pontos de Sobrevivência: {character.survivalPoints}
          </span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">Riquezas: {character.riches}</span>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Equipamento</h2>
        <ul className="mt-2 flex flex-col gap-1 text-sm">
          {items.map((item) => (
            <li key={item.id} className="rounded-md border border-border bg-surface px-3 py-1.5">
              {item.name}
            </li>
          ))}
        </ul>
      </section>

      {character.personality && (
        <section>
          <h2 className="text-lg font-semibold">Personalidade</h2>
          <p className="mt-2 text-sm text-foreground/80">{character.personality}</p>
        </section>
      )}

      {character.background && (
        <section>
          <h2 className="text-lg font-semibold">História</h2>
          <p className="mt-2 text-sm text-foreground/80">{character.background}</p>
        </section>
      )}

      {character.description && (
        <section>
          <h2 className="text-lg font-semibold">Descrição física</h2>
          <p className="mt-2 text-sm text-foreground/80">{character.description}</p>
        </section>
      )}

      {storyArc?.quest && (
        <section>
          <h2 className="text-lg font-semibold">Arco Narrativo</h2>
          <p className="mt-2 text-sm text-foreground/80">Quest: {storyArc.quest}</p>
          <ul className="mt-1 list-inside list-decimal text-sm text-foreground/80">
            {(storyArc.acts ?? []).map(
              (act, i) => act && <li key={i}>Ato {i + 1}: {act}</li>,
            )}
          </ul>
        </section>
      )}

      <p className="text-xs text-foreground/50">
        Exportar em PDF, editar e importar de volta chegam na Fase 2.
      </p>
    </div>
  );
}
