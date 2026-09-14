"use client";

import { useActionState } from "react";
import {
  importUpdateCharacterAction,
  type ImportFormState,
} from "@/lib/actions/character-import";

export function ImportUpdateForm({ characterId }: { characterId: string }) {
  const action = importUpdateCharacterAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<ImportFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-2 text-sm">
      <label className="flex flex-col gap-1">
        Reimportar .json (substitui os dados desta ficha)
        <input type="file" name="file" accept="application/json" required />
      </label>
      {state?.message && <p className="text-red-600">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-accent px-3 py-1.5 text-accent disabled:opacity-60"
      >
        {pending ? "Importando..." : "Importar e atualizar"}
      </button>
    </form>
  );
}
