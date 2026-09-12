import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { DescriptionForm } from "@/components/wizard/DescriptionForm";
import { prisma } from "@/lib/db";
import type { WayKey } from "@/lib/game-data/ways";
import { fromJson } from "@/lib/character-domains";
import type { TraitOption } from "@/lib/game-data/traits";

export default async function Step8Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 8);
  const ways = await prisma.characterWay.findMany({ where: { characterId: character.id } });

  const wayLevels = Object.fromEntries(
    ways.map((w) => {
      const level = w.rating >= 4 ? "high" : w.rating <= 2 ? "low" : "neutral";
      return [w.way, level];
    }),
  ) as Record<WayKey, "high" | "low" | "neutral">;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 8: Descrição do Personagem</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Todo personagem tem dois Traços — uma Qualidade e um Defeito — cada
          um ligado a uma Via com nível alto (4-5) ou baixo (1-2).
        </p>
      </div>
      <DescriptionForm
        characterId={character.id}
        wayLevels={wayLevels}
        currentName={character.name}
        currentTraits={fromJson<{ quality?: TraitOption; flaw?: TraitOption } | null>(
          character.traits,
          null,
        )}
        currentPersonality={character.personality}
        currentBackground={character.background}
        currentDescription={character.description}
      />
    </div>
  );
}
