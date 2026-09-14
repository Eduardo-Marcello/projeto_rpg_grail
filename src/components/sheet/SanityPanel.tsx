"use client";

import { useTransition } from "react";
import { setTormentAction, setRoutAction } from "@/lib/actions/character-sheet";
import { TORMENTS, ROUTS } from "@/lib/game-data/afflictions";

export function SanityPanel({
  characterId,
  mentalResistance,
  torment,
  rout,
}: {
  characterId: string;
  mentalResistance: number;
  torment: string | null;
  rout: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-md border border-border bg-surface p-4 text-sm">
      <p className="font-semibold">Sanidade</p>
      <p className="text-xs text-foreground/60">Resistência Mental: {mentalResistance}</p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium">
            Torment (só 1 por vez, p.287-288)
          </label>
          <select
            value={torment ?? ""}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() => setTormentAction(characterId, e.target.value || null))
            }
            className="w-full rounded-md border border-border bg-background px-2 py-1.5"
          >
            <option value="">— nenhum —</option>
            {TORMENTS.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          {torment && (
            <p className="mt-1 text-xs text-foreground/60">
              {TORMENTS.find((t) => t.name === torment)?.summary}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Rout (só 1 por vez, p.287, 289)</label>
          <select
            value={rout ?? ""}
            disabled={isPending}
            onChange={(e) =>
              startTransition(() => setRoutAction(characterId, e.target.value || null))
            }
            className="w-full rounded-md border border-border bg-background px-2 py-1.5"
          >
            <option value="">— nenhum —</option>
            {ROUTS.map((r) => (
              <option key={r.name} value={r.name}>
                {r.name}
              </option>
            ))}
          </select>
          {rout && (
            <p className="mt-1 text-xs text-foreground/60">
              {ROUTS.find((r) => r.name === rout)?.summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
