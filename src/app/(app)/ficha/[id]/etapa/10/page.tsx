import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { StoryArcForm } from "@/components/wizard/StoryArcForm";
import { getColor } from "@/lib/game-data/colors";
import type { ColorKey } from "@/lib/game-data/colors";
import { fromJson } from "@/lib/character-domains";

export default async function Step10Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 10);
  const storyArc = fromJson<{ quest?: string; acts?: string[] }>(character.storyArc, {});
  const color = character.color ? getColor(character.color as ColorKey) : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 10: Arco Narrativo</h1>
        <p className="mt-1 text-sm text-foreground/70">
          O Arco Narrativo do personagem está ligado à sua Cor
          {color ? ` (${color.name})` : ""} e deve refletir as motivações
          dela. É dividido em uma Quest e 3 Atos (p.205-207).
        </p>
      </div>
      <StoryArcForm
        characterId={character.id}
        currentQuest={storyArc?.quest ?? ""}
        currentActs={storyArc?.acts ?? []}
      />
    </div>
  );
}
