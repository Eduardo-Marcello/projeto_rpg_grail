import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { WaysForm } from "@/components/wizard/WaysForm";
import { prisma } from "@/lib/db";
import { WAYS, type WayKey } from "@/lib/game-data/ways";

export default async function Step3Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 3);
  const ways = await prisma.characterWay.findMany({ where: { characterId: character.id } });
  const currentRatings = Object.fromEntries(
    WAYS.map((w) => [w.key, ways.find((cw) => cw.way === w.key)?.rating]),
  ) as Record<WayKey, number | undefined>;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 3: Vias</h1>
        <p className="mt-1 text-sm text-foreground/70">
          As cinco Vias definem as inclinações mentais do personagem e
          entram nas rolagens de Resolução junto com os Domínios.
        </p>
      </div>
      <WaysForm characterId={character.id} currentRatings={currentRatings} />
    </div>
  );
}
