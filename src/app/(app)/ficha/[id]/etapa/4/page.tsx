import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { OccupationForm } from "@/components/wizard/OccupationForm";
import { fromJson, type CreationChoices } from "@/lib/character-domains";

export default async function Step4Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 4);
  const choices = fromJson<CreationChoices>(character.creationChoices, {});

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 4: Ocupação e Perícias</h1>
        <p className="mt-1 text-sm text-foreground/70">
          A Ocupação define a atividade principal do personagem e concede
          pontos em Domínios: 5 no Primário, 3 em um Secundário e 1 em um
          Terciário (escolha do jogador entre as opções da Ocupação).
        </p>
      </div>
      <OccupationForm
        characterId={character.id}
        currentOccupation={character.occupation}
        currentSecondary={choices.occupation?.secondary ?? null}
        currentTertiary={choices.occupation?.tertiary ?? null}
        currentPlus2={choices.otherPursuits?.plus2 ?? []}
        currentPlus1={choices.otherPursuits?.plus1 ?? []}
      />
    </div>
  );
}
