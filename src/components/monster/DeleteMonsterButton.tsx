"use client";

import { useTransition } from "react";
import { deleteMonsterAction } from "@/lib/actions/monsters";

export function DeleteMonsterButton({
  monsterId,
  monsterName,
  className,
}: {
  monsterId: string;
  monsterName: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        const ok = window.confirm(
          `Excluir "${monsterName || "este monstro/NPC"}"? Essa ação não pode ser desfeita.`,
        );
        if (!ok) return;
        startTransition(() => deleteMonsterAction(monsterId));
      }}
      className={
        className ??
        "rounded-md border border-red-600/50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-600/10 disabled:opacity-50"
      }
    >
      {isPending ? "Excluindo..." : "Excluir"}
    </button>
  );
}
