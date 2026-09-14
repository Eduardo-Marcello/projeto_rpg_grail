"use client";

import { useTransition } from "react";
import { deleteCharacterAction } from "@/lib/actions/character";

export function DeleteCharacterButton({
  characterId,
  characterName,
  className,
}: {
  characterId: string;
  characterName: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const ok = window.confirm(
          `Excluir "${characterName || "esta ficha"}"? Essa ação não pode ser desfeita.`,
        );
        if (!ok) return;
        startTransition(() => deleteCharacterAction(characterId));
      }}
      className={
        className ??
        "rounded-md border border-red-600/50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-600/10 disabled:opacity-50"
      }
    >
      {isPending ? "Excluindo..." : "Excluir ficha"}
    </button>
  );
}
