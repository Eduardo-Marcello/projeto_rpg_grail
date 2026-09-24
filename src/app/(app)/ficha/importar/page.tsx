"use client";

import { useActionState } from "react";
import {
  importNewCharacterAction,
  type ImportFormState,
} from "@/lib/actions/character-import";

export default function ImportarFichaPage() {
  const [state, formAction, pending] = useActionState<ImportFormState, FormData>(
    importNewCharacterAction,
    undefined,
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Importar ficha</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Suba um arquivo <code className="rounded bg-background px-1">.json</code> exportado
          daqui (aba da ficha → &ldquo;Exportar .json&rdquo;) para criar uma nova ficha com esses
          dados.
        </p>
      </div>
      <form action={formAction} className="flex flex-col gap-2 text-sm">
        <input
          type="file"
          name="file"
          accept="application/json"
          required
          className="cursor-pointer text-sm file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-foreground hover:file:opacity-90"
        />
        {state?.message && <p className="text-red-600">{state.message}</p>}
        <button
          type="submit"
          disabled={pending}
          className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
        >
          {pending ? "Importando..." : "Importar"}
        </button>
      </form>
    </div>
  );
}
