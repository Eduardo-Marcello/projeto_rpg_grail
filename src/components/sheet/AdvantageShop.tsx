"use client";

import { useTransition } from "react";
import { buyAdvantageAction } from "@/lib/actions/character-sheet";
import { ADVANTAGES, type AdvantageKey } from "@/lib/game-data/advantages";

export function AdvantageShop({
  characterId,
  experience,
  currentAdvantages,
}: {
  characterId: string;
  experience: number;
  currentAdvantages: { key: string; times: number }[];
}) {
  const [isPending, startTransition] = useTransition();
  // Vantagens com * (creationOnly) não podem ser compradas depois — só as
  // demais, "podem ser adquiridas no curso do jogo" (p.189).
  const buyable = ADVANTAGES.filter((a) => !a.creationOnly);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-foreground/60">
        Vantagens marcadas com * na Etapa 6 só podiam ser compradas na criação — aqui só aparecem
        as que também podem ser adquiridas depois (p.189), gastando a Experiência acumulada em
        jogo ({experience} XP disponíveis).
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {buyable.map((a) => {
          const owned = currentAdvantages.find((x) => x.key === a.key);
          const maxedOut = !!owned && owned.times >= a.maxTimes;
          const canAfford = experience >= a.cost;
          return (
            <div key={a.key} className="rounded-md border border-border bg-surface p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {a.name} {owned ? `(possui${owned.times > 1 ? " 2x" : ""})` : ""}
                </span>
                <button
                  type="button"
                  disabled={isPending || maxedOut || !canAfford}
                  onClick={() =>
                    startTransition(() => buyAdvantageAction(characterId, a.key as AdvantageKey))
                  }
                  className="shrink-0 rounded border border-accent px-2 py-0.5 text-accent disabled:opacity-40"
                >
                  {maxedOut ? "máx." : `comprar (${owned ? a.repeatCost ?? a.cost : a.cost} XP)`}
                </button>
              </div>
              <p className="mt-1 text-foreground/60">{a.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
