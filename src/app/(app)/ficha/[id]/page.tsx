import { redirect } from "next/navigation";
import { requireOwnedCharacter } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { getColor, type ColorKey } from "@/lib/game-data/colors";
import { getOrigin, type OriginKey } from "@/lib/game-data/origins";
import { getOccupation, type OccupationKey } from "@/lib/game-data/occupations";
import { WAYS } from "@/lib/game-data/ways";
import { fromJson } from "@/lib/character-domains";
import { HealthPanel } from "@/components/sheet/HealthPanel";
import { CountersPanel } from "@/components/sheet/CountersPanel";
import { SanityPanel } from "@/components/sheet/SanityPanel";
import { DomainsPanel } from "@/components/sheet/DomainsPanel";
import { AdvantageShop } from "@/components/sheet/AdvantageShop";
import { BasicInfoForm } from "@/components/sheet/BasicInfoForm";
import { StoryArcEditForm } from "@/components/sheet/StoryArcEditForm";
import { ImportUpdateForm } from "@/components/sheet/ImportUpdateForm";
import { EquipmentPanel } from "@/components/wizard/EquipmentPanel";

export default async function CharacterViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  if (character.status !== "COMPLETE") {
    redirect(`/ficha/${character.id}/etapa/${character.creationStep + 1}`);
  }

  const [ways, domains, items] = await Promise.all([
    prisma.characterWay.findMany({ where: { characterId: character.id } }),
    prisma.characterDomain.findMany({
      where: { characterId: character.id },
      orderBy: { rating: "desc" },
    }),
    prisma.characterItem.findMany({ where: { characterId: character.id } }),
  ]);

  const traits = fromJson<{ quality?: { word: string }; flaw?: { word: string } } | null>(
    character.traits,
    null,
  );
  const storyArc = fromJson<{ quest?: string; acts?: string[] }>(character.storyArc, {});
  const advantages = fromJson<{ key: string; times: number }[]>(character.advantages, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{character.name}</h1>
          <p className="mt-1 text-sm text-foreground/70">
            {character.color && getColor(character.color as ColorKey).name} ·{" "}
            {character.origin && getOrigin(character.origin as OriginKey).name} ·{" "}
            {character.occupation && getOccupation(character.occupation as OccupationKey).name} ·{" "}
            {character.age} anos
          </p>
          {traits && (
            <p className="mt-1 text-sm text-foreground/70">
              Qualidade: {traits.quality?.word} · Defeito: {traits.flaw?.word}
            </p>
          )}
        </div>
        <div className="flex gap-2 text-sm">
          <a
            href={`/ficha/${character.id}/pdf`}
            className="rounded-md border border-accent px-3 py-1.5 text-accent"
          >
            Exportar PDF
          </a>
          <a
            href={`/ficha/${character.id}/json`}
            className="rounded-md border border-border px-3 py-1.5"
          >
            Exportar .json
          </a>
        </div>
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Vias</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {WAYS.map((w) => (
            <span key={w.key} className="rounded-md border border-border bg-surface px-3 py-1">
              {w.name}: {ways.find((cw) => cw.way === w.key)?.rating ?? 0}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Atributos e Recursos</h2>
        <div className="mb-2 flex flex-wrap gap-2 text-sm">
          <span className="rounded-md border border-border bg-surface px-3 py-1">
            Potencial: {character.potential}
          </span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">
            Defesa: {character.defense}
          </span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">
            Velocidade: {character.speed}
          </span>
          <span className="rounded-md border border-border bg-surface px-3 py-1">
            Vigor: {character.stamina}
          </span>
        </div>
        <CountersPanel
          characterId={character.id}
          survivalPoints={character.survivalPoints}
          survivalPointsCurrent={character.survivalPointsCurrent}
          magicPoints={character.magicPoints}
          magicPointsCurrent={character.magicPointsCurrent}
          riches={character.riches}
        />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Saúde e Sanidade</h2>
        <div className="flex flex-col gap-3">
          <HealthPanel characterId={character.id} healthBoxesChecked={character.healthBoxesChecked} />
          <SanityPanel
            characterId={character.id}
            mentalResistance={character.mentalResistance}
            torment={character.torment}
            rout={character.rout}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Domínios e Disciplinas</h2>
        <DomainsPanel
          characterId={character.id}
          domains={domains.map((d) => ({
            domainKey: d.domainKey,
            rating: d.rating,
            bonus: d.bonus,
            penalty: d.penalty,
            disciplines: fromJson<{ name: string; rating: number }[]>(d.disciplines, []),
          }))}
          experience={character.experience}
        />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Equipamento</h2>
        <EquipmentPanel
          characterId={character.id}
          riches={character.riches}
          items={items}
          showContinueButton={false}
        />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Vantagens (adquirir em jogo)</h2>
        <AdvantageShop
          characterId={character.id}
          experience={character.experience}
          currentAdvantages={advantages}
        />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Descrição</h2>
        <BasicInfoForm
          characterId={character.id}
          name={character.name}
          personality={character.personality}
          background={character.background}
          description={character.description}
        />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Arco Narrativo</h2>
        <StoryArcEditForm
          characterId={character.id}
          quest={storyArc.quest ?? ""}
          acts={storyArc.acts ?? []}
        />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Atualizar a partir de um arquivo</h2>
        <ImportUpdateForm characterId={character.id} />
      </section>

      <p className="text-xs text-foreground/50">
        Simplificado por ora: Posturas de Combate (Atk/Def/Spd por postura),
        o sistema de Magia completo e a trilha de 3 partes de
        Ascensão/Desgraça ainda não estão implementados em detalhe — ver
        conversa com o assistente.
      </p>
    </div>
  );
}
