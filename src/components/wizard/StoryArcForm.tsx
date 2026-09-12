"use client";

import { useActionState } from "react";
import { saveStoryArcAction, type StepFormState } from "@/lib/actions/character";

export function StoryArcForm({
  characterId,
  currentQuest,
  currentActs,
}: {
  characterId: string;
  currentQuest: string;
  currentActs: string[];
}) {
  const action = saveStoryArcAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<StepFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Quest (o objetivo difícil que guia o Arco)
        <textarea
          name="quest"
          defaultValue={currentQuest}
          rows={2}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>
      {[0, 1, 2].map((i) => (
        <label key={i} className="flex flex-col gap-1 text-sm">
          Ato {i + 1} (resumo — os Passos concretos são definidos pelo mestre durante o jogo)
          <textarea
            name={`act${i + 1}`}
            defaultValue={currentActs[i] ?? ""}
            rows={2}
            className="rounded-md border border-border bg-background px-3 py-2"
          />
        </label>
      ))}
      <p className="text-xs text-foreground/60">
        Esta etapa é opcional no livro — pode ser definida agora ou depois de
        algumas sessões (p.207). Pode deixar em branco e continuar.
      </p>

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
