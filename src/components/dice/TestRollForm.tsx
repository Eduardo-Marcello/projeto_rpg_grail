"use client";

import { useState, useTransition } from "react";
import { rollTestAction } from "@/lib/actions/dice";
import { DIFFICULTY_THRESHOLDS } from "@/lib/dice";
import { DiceRollAnimation } from "@/components/dice/DiceRollAnimation";
import { withMinDelay } from "@/lib/min-delay";
import type { DomainKey } from "@/lib/game-data/domains";

interface DomainOption {
  key: DomainKey;
  name: string;
  wayName: string;
  rating: number;
  disciplines: { name: string; rating: number }[];
}

export function TestRollForm({
  characterId,
  domains,
}: {
  characterId: string;
  domains: DomainOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const [domainKey, setDomainKey] = useState<DomainKey>(domains[0]?.key);
  const [disciplineIndex, setDisciplineIndex] = useState<string>("");
  const [threshold, setThreshold] = useState<string>("");

  const selected = domains.find((d) => d.key === domainKey);

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set("domainKey", domainKey);
        if (disciplineIndex !== "") formData.set("disciplineIndex", disciplineIndex);
        if (threshold !== "") formData.set("threshold", threshold);
        startTransition(async () => {
          await withMinDelay(rollTestAction(characterId, formData), 700);
        });
      }}
    >
      <h3 className="font-semibold">/teste [tipo]</h3>
      <p className="text-xs text-foreground/60">
        Domínio (ou Disciplina) + Via + 1D10, contra o Limiar de Dificuldade — p.244-257.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        Domínio / Disciplina
        <select
          className="rounded-md border border-border bg-background px-2 py-1.5"
          value={domainKey}
          onChange={(e) => {
            setDomainKey(e.target.value as DomainKey);
            setDisciplineIndex("");
          }}
        >
          {domains.map((d) => (
            <optgroup key={d.key} label={`${d.name} (Via ${d.wayName})`}>
              <option value={d.key}>
                {d.name} — {d.rating}
              </option>
            </optgroup>
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
        Limiar de Dificuldade anunciado pelo mestre (opcional)
        <input
          type="number"
          maxLength={2}
          className="rounded-md border border-border bg-background px-2 py-1.5"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value.slice(0, 2))}
          placeholder="ex: 11"
        />
      </label>
      <p className="text-xs text-foreground/50">
        {DIFFICULTY_THRESHOLDS.map((t) => `${t.level} ${t.value}`).join(" · ")}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || !domainKey}
          className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          {isPending ? "Rolando..." : "Rolar"}
        </button>
        <DiceRollAnimation active={isPending} />
      </div>
    </form>
  );
}
