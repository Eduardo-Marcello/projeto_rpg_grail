"use client";

import { useActionState } from "react";
import { saveColorAction, type StepFormState } from "@/lib/actions/character";
import { COLORS } from "@/lib/game-data/colors";

export function ColorForm({
  characterId,
  currentColor,
}: {
  characterId: string;
  currentColor: string | null;
}) {
  const action = saveColorAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<StepFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {COLORS.map((color) => (
          <label
            key={color.key}
            className="flex cursor-pointer flex-col gap-1 rounded-md border border-border bg-surface p-4 text-sm has-checked:border-accent"
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="color"
                value={color.key}
                defaultChecked={currentColor === color.key}
                required
              />
              <span className="font-semibold">{color.name}</span>
            </div>
            <p className="text-foreground/70">{color.summary}</p>
            <p className="italic text-foreground/60">{color.stance}</p>
            <p className="text-xs text-foreground/50">
              Ex: {color.occupationExamples.join(", ")}
            </p>
          </label>
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
