"use client";

import { useActionState, useMemo, useState } from "react";
import { saveAgeAction, type StepFormState } from "@/lib/actions/character";
import { getAgeBand } from "@/lib/game-data/age";
import { DOMAINS, type DomainKey } from "@/lib/game-data/domains";
import { DISADVANTAGES, type DisadvantageKey } from "@/lib/game-data/disadvantages";
import { ageDisadvantageTotal } from "@/lib/character-calc";

export function AgeForm({
  characterId,
  currentAge,
  currentBonusDomains,
  currentAgeDisadvantages,
}: {
  characterId: string;
  currentAge: number | null;
  currentBonusDomains: DomainKey[];
  currentAgeDisadvantages: { key: string; times: number }[];
}) {
  const action = saveAgeAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<StepFormState, FormData>(
    action,
    undefined,
  );
  const [age, setAge] = useState<number | "">(currentAge ?? "");
  const [checked, setChecked] = useState<Set<DisadvantageKey>>(
    new Set(currentAgeDisadvantages.map((d) => d.key as DisadvantageKey)),
  );
  const [twoX, setTwoX] = useState<Set<DisadvantageKey>>(
    new Set(
      currentAgeDisadvantages.filter((d) => d.times > 1).map((d) => d.key as DisadvantageKey),
    ),
  );

  const band = typeof age === "number" && age >= 15 ? getAgeBand(age) : null;

  const disadvantageCosts = useMemo(
    () => Object.fromEntries(DISADVANTAGES.map((d) => [d.key, d])),
    [],
  );
  const total = useMemo(() => {
    const selections = Array.from(checked).map((key) => ({
      key,
      times: twoX.has(key) ? 2 : 1,
    }));
    return ageDisadvantageTotal(selections, disadvantageCosts);
  }, [checked, twoX, disadvantageCosts]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Idade (mínimo 15)
        <input
          type="number"
          name="age"
          min={15}
          required
          value={age}
          onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-32 rounded-md border border-border bg-background px-3 py-2"
        />
      </label>

      {band && (
        <div className="rounded-md border border-border bg-surface p-4 text-sm">
          <p>
            Faixa <strong>{band.label}</strong>: +1 nível em {band.domainBonusCount}{" "}
            Domínio(s) distintos; {band.disadvantagePoints} pontos obrigatórios em
            Desvantagens (sem XP).
          </p>
        </div>
      )}

      {band && band.domainBonusCount > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">Domínios que recebem +1 (idade):</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: band.domainBonusCount }).map((_, i) => (
              <select
                key={i}
                name={`ageBonus_${i}`}
                defaultValue={currentBonusDomains[i] ?? ""}
                required
                className="rounded-md border border-border bg-background px-2 py-1 text-sm"
              >
                <option value="" disabled>
                  —
                </option>
                {DOMAINS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.name}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>
      )}

      {band && band.disadvantagePoints > 0 && (
        <div>
          <p className="mb-1 text-sm font-medium">
            Escolha Desvantagens somando exatamente {band.disadvantagePoints} pontos (sem XP):
          </p>
          <p className="mb-2 text-xs text-foreground/60">Total selecionado: {total} pontos</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {DISADVANTAGES.map((d) => (
              <div key={d.key} className="rounded-md border border-border bg-surface p-2 text-xs">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    name={`ageDis_${d.key}`}
                    checked={checked.has(d.key)}
                    onChange={(e) => {
                      const next = new Set(checked);
                      if (e.target.checked) next.add(d.key);
                      else next.delete(d.key);
                      setChecked(next);
                    }}
                  />
                  {d.name} ({d.cost} pts)
                </label>
                {checked.has(d.key) && d.maxTimes === 2 && (
                  <label className="ml-6 flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={`ageDis_${d.key}_2x`}
                      checked={twoX.has(d.key)}
                      onChange={(e) => {
                        const next = new Set(twoX);
                        if (e.target.checked) next.add(d.key);
                        else next.delete(d.key);
                        setTwoX(next);
                      }}
                    />
                    2x: {d.repeatName} (+{d.repeatCost} pts)
                  </label>
                )}
                <p className="mt-1 text-foreground/60">{d.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || !band}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
