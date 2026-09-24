"use client";

import { useState, useTransition } from "react";
import { rollAttackAction } from "@/lib/actions/dice";
import { stanceLabel, type Stance } from "@/lib/dice";
import { DiceRollAnimation } from "@/components/dice/DiceRollAnimation";
import { withMinDelay } from "@/lib/min-delay";
import type { DomainKey } from "@/lib/game-data/domains";

interface DomainOption {
  key: DomainKey;
  name: string;
  rating: number;
  disciplines: { name: string; rating: number }[];
}

interface WeaponOption {
  id: string;
  name: string;
  damage: number;
}

const STANCES: Stance[] = ["STANDARD", "OFFENSIVE", "DEFENSIVE"];

export function AttackRollForm({
  characterId,
  combatDomains,
  weapons,
}: {
  characterId: string;
  combatDomains: DomainOption[];
  weapons: WeaponOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [domainKey, setDomainKey] = useState<DomainKey | undefined>(combatDomains[0]?.key);
  const [disciplineIndex, setDisciplineIndex] = useState<string>("");
  const [stance, setStance] = useState<Stance>("STANDARD");
  const [itemId, setItemId] = useState<string>("");

  const selected = combatDomains.find((d) => d.key === domainKey);

  if (!domainKey) {
    return (
      <p className="text-sm text-foreground/60">
        Este personagem não tem nenhum dos Domínios de combate (Combate Corpo a Corpo,
        Tiro e Lançamento, Combate Montado).
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("domainKey", domainKey);
        if (disciplineIndex !== "") formData.set("disciplineIndex", disciplineIndex);
        formData.set("stance", stance);
        if (itemId) formData.set("itemId", itemId);
        startTransition(async () => {
          await withMinDelay(rollAttackAction(characterId, formData), 700);
        });
      }}
    >
      <h3 className="font-semibold">/atacar</h3>
      <p className="text-xs text-foreground/60">
        Combatividade + Domínio (ou Disciplina) de luta + modificador de Postura + 1D10 — p.264.
        O mestre subtrai a Defesa e a Proteção do alvo para saber o dano final.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        Domínio / Disciplina de luta
        <select
          className="rounded-md border border-border bg-background px-2 py-1.5"
          value={domainKey}
          onChange={(e) => {
            setDomainKey(e.target.value as DomainKey);
            setDisciplineIndex("");
          }}
        >
          {combatDomains.map((d) => (
            <option key={d.key} value={d.key}>
              {d.name} — {d.rating}
            </option>
          ))}
        </select>
      </label>

      {selected && selected.disciplines.length > 0 && (
        <label className="flex flex-col gap-1 text-sm">
          Usar Disciplina em vez do Domínio (opcional)
          <select
            className="rounded-md border border-border bg-background px-2 py-1.5"
            value={disciplineIndex}
            onChange={(e) => setDisciplineIndex(e.target.value)}
          >
            <option value="">— usar o Domínio ({selected.rating}) —</option>
            {selected.disciplines.map((disc, i) => (
              <option key={i} value={i}>
                {disc.name} — {disc.rating}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Postura de Combate
        <select
          className="rounded-md border border-border bg-background px-2 py-1.5"
          value={stance}
          onChange={(e) => setStance(e.target.value as Stance)}
        >
          {STANCES.map((s) => (
            <option key={s} value={s}>
              {stanceLabel(s)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Arma
        <select
          className="rounded-md border border-border bg-background px-2 py-1.5"
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        >
          <option value="">Desarmado (dano 0)</option>
          {weapons.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} — dano {w.damage}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          {isPending ? "Rolando..." : "Atacar"}
        </button>
        <DiceRollAnimation active={isPending} />
      </div>
    </form>
  );
}
