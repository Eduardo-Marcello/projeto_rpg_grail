import Link from "next/link";
import { requireMonster } from "@/lib/dal";
import { fromJson } from "@/lib/character-domains";
import { EMPTY_MONSTER_STATS, type MonsterStats } from "@/lib/monster-stats";
import {
  addTraitAction,
  removeTraitAction,
  addSpecialAbilityAction,
  removeSpecialAbilityAction,
} from "@/lib/actions/monsters";
import { MonsterBasicsForm } from "@/components/monster/MonsterBasicsForm";
import { MonsterCombatStatsForm } from "@/components/monster/MonsterCombatStatsForm";
import { NamedListEditor } from "@/components/monster/NamedListEditor";
import { SkillsEditor } from "@/components/monster/SkillsEditor";
import { DeleteMonsterButton } from "@/components/monster/DeleteMonsterButton";

export default async function MonsterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const monster = await requireMonster(id);
  const stats = fromJson<MonsterStats>(monster.stats, EMPTY_MONSTER_STATS);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/mestre" className="text-sm text-accent">
            ← Voltar
          </Link>
          <h1 className="mt-1 text-2xl font-semibold">{monster.name}</h1>
        </div>
        <DeleteMonsterButton monsterId={monster.id} monsterName={monster.name} />
      </div>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Informações gerais</h2>
        <MonsterBasicsForm
          monsterId={monster.id}
          name={monster.name}
          wyrdnessLevel={monster.wyrdnessLevel}
          overview={stats.overview}
          description={stats.description}
          notes={monster.notes}
        />
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold">Estatísticas</h2>
        <MonsterCombatStatsForm monsterId={monster.id} stats={stats} />
      </section>

      <section>
        <NamedListEditor
          title="Traços"
          helpText="Habilidades definidoras do monstro/NPC — vantagem ou fraqueza (p.368)."
          items={stats.traits}
          onAdd={addTraitAction.bind(null, monster.id)}
          onRemove={removeTraitAction.bind(null, monster.id)}
        />
      </section>

      <section>
        <NamedListEditor
          title="Habilidades Especiais"
          helpText="Usadas em batalha no lugar do ataque normal; só 1x a cada 3 Rounds (p.368-369)."
          items={stats.specialAbilities}
          onAdd={addSpecialAbilityAction.bind(null, monster.id)}
          onRemove={removeSpecialAbilityAction.bind(null, monster.id)}
        />
      </section>

      <section>
        <SkillsEditor monsterId={monster.id} skills={stats.skills} />
      </section>
    </div>
  );
}
