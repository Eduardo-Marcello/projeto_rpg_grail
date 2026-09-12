import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { AgeForm } from "@/components/wizard/AgeForm";
import { fromJson, type CreationChoices } from "@/lib/character-domains";

export default async function Step5Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 5);
  const choices = fromJson<CreationChoices>(character.creationChoices, {});

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 5: Idade</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Quanto mais velho o personagem, mais bônus em Domínios ele
          acumulou — mas mais pesado é o fardo do seu passado, refletido em
          Desvantagens obrigatórias que não concedem Experiência.
        </p>
      </div>
      <AgeForm
        characterId={character.id}
        currentAge={character.age}
        currentBonusDomains={choices.ageBonusDomains ?? []}
        currentAgeDisadvantages={choices.ageDisadvantages ?? []}
      />
    </div>
  );
}
