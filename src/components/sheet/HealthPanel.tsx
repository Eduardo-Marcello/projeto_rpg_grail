"use client";

import { useTransition } from "react";
import { adjustHealthAction } from "@/lib/actions/character-sheet";
import { getHealthStatus, HEALTH_TIERS } from "@/lib/health";

export function HealthPanel({
  characterId,
  healthBoxesChecked,
}: {
  characterId: string;
  healthBoxesChecked: number;
}) {
  const [isPending, startTransition] = useTransition();
  const status = getHealthStatus(healthBoxesChecked);

  return (
    <div className="rounded-md border border-border bg-surface p-4 text-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">
            Condição de Saúde: {status.tier.name}
            {status.penalty !== 0 && (
              <span className="text-red-600"> ({status.penalty} em rolagens)</span>
            )}
          </p>
          <p className="text-xs text-foreground/60">
            {status.checked}/{status.total} caixas marcadas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isPending || status.checked === 0}
            onClick={() => startTransition(() => adjustHealthAction(characterId, -1))}
            className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
          >
            − Curar
          </button>
          <button
            type="button"
            disabled={isPending || status.inAgony}
            onClick={() => startTransition(() => adjustHealthAction(characterId, 1))}
            className="rounded-md border border-accent px-3 py-1 text-accent disabled:opacity-40"
          >
            + Dano
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {HEALTH_TIERS.map((tier) => {
          let boxesBefore = 0;
          for (const t of HEALTH_TIERS) {
            if (t.key === tier.key) break;
            boxesBefore += t.boxes;
          }
          return (
            <div key={tier.key} className="flex items-center gap-1">
              <span className="text-xs text-foreground/50">{tier.name}</span>
              {Array.from({ length: tier.boxes }).map((_, i) => {
                const boxIndex = boxesBefore + i + 1;
                const checked = boxIndex <= status.checked;
                return (
                  <span
                    key={i}
                    className={
                      "inline-block h-3 w-3 rounded-sm border " +
                      (checked ? "border-accent bg-accent" : "border-border")
                    }
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {status.inAgony && (
        <p className="mt-2 text-xs text-red-600">
          Em Agonia: o personagem desmaia. Outro personagem precisa de uma rolagem de Cura
          Difícil (17) para estabilizá-lo (p.275).
        </p>
      )}
    </div>
  );
}
