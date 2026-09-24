"use client";

import { useActionState } from "react";
import { deleteAccountAction } from "@/lib/actions/auth";
import type { AuthFormState } from "@/lib/definitions/auth";

export function DeleteAccountForm({ username }: { username: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    deleteAccountAction,
    undefined,
  );

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const ok = window.confirm(
          "Excluir sua conta, suas fichas de personagem e (se você for Mestre) os monstros/NPCs que cadastrou? Essa ação não pode ser desfeita.",
        );
        if (!ok) e.preventDefault();
      }}
      className="flex flex-col gap-3"
    >
      <p className="text-sm text-foreground/70">
        Isso apaga sua conta, todas as suas fichas de personagem e, se você for Mestre, os
        monstros/NPCs que cadastrou (eles são compartilhados com a mesa, mas ficam ligados à
        conta de quem criou). Não pode ser desfeito.
      </p>

      <label className="flex flex-col gap-1 text-sm">
        Digite <strong>{username}</strong> para confirmar
        <input
          name="confirmUsername"
          required
          autoComplete="off"
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md border border-red-600/50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-600/10 disabled:opacity-50"
      >
        {pending ? "Excluindo..." : "Excluir minha conta"}
      </button>
    </form>
  );
}
