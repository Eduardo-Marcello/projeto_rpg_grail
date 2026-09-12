"use client";

import { useActionState, useState } from "react";
import { saveOriginAction, type StepFormState } from "@/lib/actions/character";
import { ORIGINS, type OriginKey } from "@/lib/game-data/origins";
import { domainsForWay } from "@/lib/game-data/domains";
import { getWay } from "@/lib/game-data/ways";

export function OriginForm({
  characterId,
  currentOrigin,
  currentBonusDomain,
}: {
  characterId: string;
  currentOrigin: string | null;
  currentBonusDomain: string | null;
}) {
  const action = saveOriginAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<StepFormState, FormData>(
    action,
    undefined,
  );
  const [origin, setOrigin] = useState<OriginKey | null>(
    (currentOrigin as OriginKey) ?? null,
  );

  const bonusDomainOptions = origin
    ? domainsForWay(ORIGINS.find((o) => o.key === origin)!.bonusWay)
    : [];

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {ORIGINS.map((o) => (
          <label
            key={o.key}
            className="flex cursor-pointer flex-col gap-1 rounded-md border border-border bg-surface p-4 text-sm has-checked:border-accent"
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                name="origin"
                value={o.key}
                defaultChecked={currentOrigin === o.key}
                onChange={() => setOrigin(o.key)}
                required
              />
              <span className="font-semibold">{o.name}</span>
            </div>
            <p className="text-foreground/70">{o.summary}</p>
            <p className="text-xs text-foreground/50">
              Bônus: +1 nível em um Domínio de {getWay(o.bonusWay).name}
            </p>
          </label>
        ))}
      </div>

      {origin && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Escolha o Domínio de {getWay(ORIGINS.find((o) => o.key === origin)!.bonusWay).name}{" "}
            que recebe +1:
          </p>
          <div className="flex flex-wrap gap-2">
            {bonusDomainOptions.map((d) => (
              <label
                key={d.key}
                className="flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm has-checked:border-accent"
              >
                <input
                  type="radio"
                  name="bonusDomain"
                  value={d.key}
                  defaultChecked={currentBonusDomain === d.key}
                  required
                />
                {d.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || !origin}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
