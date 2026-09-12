import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { finalizeCharacterAction } from "@/lib/actions/character";
import { getColor, type ColorKey } from "@/lib/game-data/colors";
import { getOrigin, type OriginKey } from "@/lib/game-data/origins";
import { getOccupation, type OccupationKey } from "@/lib/game-data/occupations";
import { prisma } from "@/lib/db";
import { WAYS } from "@/lib/game-data/ways";
import { getDomain, type DomainKey } from "@/lib/game-data/domains";

export default async function StepFinalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 11);

  const [ways, domains] = await Promise.all([
    prisma.characterWay.findMany({ where: { characterId: character.id } }),
    prisma.characterDomain.findMany({
      where: { characterId: character.id },
      orderBy: { rating: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa Final: Conversa entre Jogadores</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Antes de começar, o mestre deve conversar com todos sobre
          expectativas, dúvidas e tabus da campanha (p.209). Aproveite para
          apresentar {character.name ?? "seu personagem"} ao grupo.
        </p>
      </div>

      <div className="rounded-md border border-border bg-surface p-4 text-sm">
        <p>
          <strong>{character.name}</strong> — {character.color && getColor(character.color as ColorKey).name},{" "}
          {character.origin && getOrigin(character.origin as OriginKey).name},{" "}
          {character.occupation && getOccupation(character.occupation as OccupationKey).name}, {character.age} anos
        </p>
        <p className="mt-2">
          Vias:{" "}
          {WAYS.map((w) => `${w.name} ${ways.find((cw) => cw.way === w.key)?.rating ?? 0}`).join(
            " · ",
          )}
        </p>
        <p className="mt-2">
          Domínios:{" "}
          {domains.map((d) => `${getDomain(d.domainKey as DomainKey).name} ${d.rating}`).join(" · ")}
        </p>
      </div>

      <form action={finalizeCharacterAction.bind(null, character.id)}>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Finalizar ficha
        </button>
      </form>
    </div>
  );
}
