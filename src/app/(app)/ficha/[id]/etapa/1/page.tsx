import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { ColorForm } from "@/components/wizard/ColorForm";

export default async function Step1Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 1);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 1: Cor</h1>
        <p className="mt-1 text-sm text-foreground/70">
          A Cor simboliza a essência do seu personagem como futuro Guardião
          de Avalon — molda seu temperamento e as aspirações que vai
          perseguir. É permanente e não pode ser repetida entre personagens
          da mesma mesa.
        </p>
      </div>
      <ColorForm characterId={character.id} currentColor={character.color} />
    </div>
  );
}
