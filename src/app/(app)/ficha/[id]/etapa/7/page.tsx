import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { EquipmentPanel } from "@/components/wizard/EquipmentPanel";
import { prisma } from "@/lib/db";

export default async function Step7Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 7);
  const items = await prisma.characterItem.findMany({ where: { characterId: character.id } });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 7: Equipamento</h1>
        <p className="mt-1 text-sm text-foreground/70">
          O personagem começa com 5 Riquezas para gastar livremente, além do
          Equipamento de Viagem gratuito (adicionado automaticamente).
          Riquezas não gastas ficam guardadas com o personagem.
        </p>
      </div>
      <EquipmentPanel characterId={character.id} riches={character.riches} items={items} />
    </div>
  );
}
