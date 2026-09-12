import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { OriginForm } from "@/components/wizard/OriginForm";
import { fromJson, type CreationChoices } from "@/lib/character-domains";

export default async function Step2Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 2);
  const choices = fromJson<CreationChoices>(character.creationChoices, {});

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 2: Origem</h1>
        <p className="mt-1 text-sm text-foreground/70">
          A Origem reflete de onde o personagem veio e concede +1 nível em
          um Domínio associado à Via correspondente.
        </p>
      </div>
      <OriginForm
        characterId={character.id}
        currentOrigin={character.origin}
        currentBonusDomain={choices.originBonusDomain ?? null}
      />
    </div>
  );
}
