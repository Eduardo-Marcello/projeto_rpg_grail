"use client";

import { useTransition } from "react";
import {
  adjustSurvivalPointsAction,
  adjustMagicPointsAction,
  adjustRichesAction,
} from "@/lib/actions/character-sheet";

function Counter({
  label,
  current,
  max,
  onDec,
  onInc,
  disabled,
}: {
  label: string;
  current: number;
  max?: number;
  onDec: () => void;
  onInc: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2 text-sm">
      <span>{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={onDec}
          className="rounded border border-border px-2 disabled:opacity-40"
        >
          −
        </button>
        <span className="w-14 text-center font-mono">
          {current}
          {max !== undefined ? `/${max}` : ""}
        </span>
        <button
          type="button"
          disabled={disabled}
          onClick={onInc}
          className="rounded border border-accent px-2 text-accent disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function CountersPanel({
  characterId,
  survivalPoints,
  survivalPointsCurrent,
  magicPoints,
  magicPointsCurrent,
  riches,
}: {
  characterId: string;
  survivalPoints: number;
  survivalPointsCurrent: number | null;
  magicPoints: number;
  magicPointsCurrent: number | null;
  riches: number;
}) {
  const [isPending, startTransition] = useTransition();
  const sp = survivalPointsCurrent ?? survivalPoints;
  const mp = magicPointsCurrent ?? magicPoints;

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <Counter
        label="Sobrevivência"
        current={sp}
        max={survivalPoints}
        disabled={isPending}
        onDec={() => startTransition(() => adjustSurvivalPointsAction(characterId, -1))}
        onInc={() => startTransition(() => adjustSurvivalPointsAction(characterId, 1))}
      />
      {magicPoints > 0 && (
        <Counter
          label="Magia"
          current={mp}
          max={magicPoints}
          disabled={isPending}
          onDec={() => startTransition(() => adjustMagicPointsAction(characterId, -1))}
          onInc={() => startTransition(() => adjustMagicPointsAction(characterId, 1))}
        />
      )}
      <Counter
        label="Riquezas"
        current={riches}
        disabled={isPending}
        onDec={() => startTransition(() => adjustRichesAction(characterId, -1))}
        onInc={() => startTransition(() => adjustRichesAction(characterId, 1))}
      />
    </div>
  );
}
