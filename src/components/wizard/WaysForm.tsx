"use client";

import { useActionState } from "react";
import { saveWaysAction, type StepFormState } from "@/lib/actions/character";
import { WAYS, type WayKey } from "@/lib/game-data/ways";

export function WaysForm({
  characterId,
  currentRatings,
}: {
  characterId: string;
  currentRatings: Record<WayKey, number | undefined>;
}) {
  const action = saveWaysAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<StepFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <p className="text-sm text-foreground/70">
        Distribua os valores 1, 2, 3, 4 e 5 entre as cinco Vias — cada valor é
        usado uma única vez. Um valor alto (4-5) é uma força; um valor baixo
        (1-2) tende a criar dificuldades em situações específicas (ver
        Falhas abaixo).
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {WAYS.map((way) => (
          <div key={way.key} className="rounded-md border border-border bg-surface p-4 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{way.name}</span>
              <select
                name={way.key}
                defaultValue={currentRatings[way.key] ?? ""}
                required
                className="rounded-md border border-border bg-background px-2 py-1"
              >
                <option value="" disabled>
                  —
                </option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-foreground/70">{way.summary}</p>
            <p className="mt-1 text-xs text-foreground/50">
              Falha: <span className="font-medium">{way.fault.name}</span> — {way.fault.summary}
            </p>
          </div>
        ))}
      </div>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
