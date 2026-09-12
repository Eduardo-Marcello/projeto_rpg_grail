import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { ExperienceForm } from "@/components/wizard/ExperienceForm";
import { prisma } from "@/lib/db";
import { fromJson, type CreationChoices } from "@/lib/character-domains";

export default async function Step6Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 6);
  const choices = fromJson<CreationChoices>(character.creationChoices, {});
  const domains = await prisma.characterDomain.findMany({ where: { characterId: character.id } });
  const domainRatings = Object.fromEntries(domains.map((d) => [d.domainKey, d.rating]));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 6: Experiência, Vantagens e Desvantagens</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Desvantagens concedem Experiência (até 5 no total); Vantagens e
          melhorias de Domínio consomem essa Experiência.
        </p>
      </div>
      <ExperienceForm
        characterId={character.id}
        currentDisadvantages={fromJson<{ key: string; times: number }[]>(
          character.disadvantages,
          [],
        )}
        currentAdvantages={fromJson<{ key: string; times: number }[]>(character.advantages, [])}
        currentDomainSpends={choices.domainXpSpends ?? []}
        currentDomainRatings={domainRatings}
        bonusXp={choices.bonusXp ?? 0}
      />
    </div>
  );
}
