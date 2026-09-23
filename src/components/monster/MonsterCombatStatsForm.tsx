"use client";

import { useTransition } from "react";
import { updateMonsterCombatStatsAction } from "@/lib/actions/monsters";
import type { MonsterStats } from "@/lib/monster-stats";

function Field({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <input
        name={name}
        type="number"
        defaultValue={defaultValue}
        className="w-full rounded-md border border-border bg-background px-2 py-1.5"
      />
    </label>
  );
}

export function MonsterCombatStatsForm({
  monsterId,
  stats,
}: {
  monsterId: string;
  stats: MonsterStats;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3"
      action={(formData) =>
        startTransition(() => updateMonsterCombatStatsAction(monsterId, formData))
      }
    >
      <p className="text-xs text-foreground/60">
        Estrutura da ficha de Bestiário — p.368: Ataque/Dano/Defesa/Proteção/Velocidade/Potencial,
        Saúde/Vigor/Resistência Mental.
      </p>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Ataque" name="attack" defaultValue={stats.attack} />
        <Field label="Dano" name="damage" defaultValue={stats.damage} />
        <Field label="Defesa" name="defense" defaultValue={stats.defense} />
        <Field label="Proteção" name="protection" defaultValue={stats.protection} />
        <Field label="Velocidade" name="speed" defaultValue={stats.speed} />
        <Field label="Potencial" name="potential" defaultValue={stats.potential} />
        <Field label="Vigor" name="stamina" defaultValue={stats.stamina} />
        <Field
          label="Resistência Mental"
          name="mentalResistance"
          defaultValue={stats.mentalResistance}
        />
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Arma (texto livre, ex: &ldquo;espada curta&rdquo; ou &ldquo;armas naturais&rdquo;)
        <input
          name="weaponLabel"
          defaultValue={stats.weaponLabel}
          className="rounded-md border border-border bg-background px-2 py-1.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Limiares de Saúde (separados por &ldquo;/&rdquo;, do maior para o menor — ex:
        &ldquo;15/10/5/3&rdquo;)
        <input
          name="health"
          defaultValue={stats.health.join("/")}
          placeholder="ex: 15/10/5/3"
          className="rounded-md border border-border bg-background px-2 py-1.5"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        {isPending ? "Salvando..." : "Salvar estatísticas"}
      </button>
    </form>
  );
}
