"use client";

import { useActionState, useMemo, useState } from "react";
import { saveExperienceAction, type StepFormState } from "@/lib/actions/character";
import { DISADVANTAGES, type DisadvantageKey } from "@/lib/game-data/disadvantages";
import { ADVANTAGES, type AdvantageKey } from "@/lib/game-data/advantages";
import { DOMAINS } from "@/lib/game-data/domains";

interface Selected {
  key: string;
  times: number;
}

export function ExperienceForm({
  characterId,
  currentDisadvantages,
  currentAdvantages,
  currentDomainSpends,
  currentDomainRatings,
  bonusXp,
}: {
  characterId: string;
  currentDisadvantages: Selected[];
  currentAdvantages: Selected[];
  currentDomainSpends: { domainKey: string; levels: number }[];
  currentDomainRatings: Record<string, number>;
  bonusXp: number;
}) {
  const action = saveExperienceAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<StepFormState, FormData>(
    action,
    undefined,
  );

  const [disSel, setDisSel] = useState<Map<DisadvantageKey, boolean>>(
    new Map(currentDisadvantages.map((d) => [d.key as DisadvantageKey, d.times > 1])),
  );
  const [advSel, setAdvSel] = useState<Map<AdvantageKey, boolean>>(
    new Map(currentAdvantages.map((a) => [a.key as AdvantageKey, a.times > 1])),
  );
  const [bonus, setBonus] = useState(bonusXp);
  const [domainLevels, setDomainLevels] = useState<Record<string, number>>(
    Object.fromEntries(currentDomainSpends.map((s) => [s.domainKey, s.levels])),
  );

  const disCost = useMemo(() => {
    let sum = 0;
    for (const [key, twoX] of disSel) {
      const def = DISADVANTAGES.find((d) => d.key === key)!;
      sum += def.cost + (twoX ? def.repeatCost ?? 0 : 0);
    }
    return sum;
  }, [disSel]);

  const advCost = useMemo(() => {
    let sum = 0;
    for (const [key, twoX] of advSel) {
      const def = ADVANTAGES.find((a) => a.key === key)!;
      sum += def.cost + (twoX ? def.repeatCost ?? 0 : 0);
    }
    return sum;
  }, [advSel]);

  const domainCost = useMemo(
    () => Object.values(domainLevels).reduce((s, l) => s + (l || 0) * 10, 0),
    [domainLevels],
  );

  const pool = bonus + disCost;
  const spent = advCost + domainCost;
  const remaining = pool - spent;
  const disCount = Array.from(disSel.values()).length;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="rounded-md border border-border bg-surface p-4 text-sm">
        <label className="flex items-center gap-2">
          XP bônus da Criação de Avalon (definido em grupo, opcional):
          <input
            type="number"
            name="bonusXp"
            min={0}
            value={bonus}
            onChange={(e) => setBonus(Number(e.target.value) || 0)}
            className="w-24 rounded-md border border-border bg-background px-2 py-1"
          />
        </label>
        <p className="mt-2 font-medium">
          Pool de XP: {pool} · Gasto: {spent} · Restante:{" "}
          <span className={remaining < 0 ? "text-red-600" : ""}>{remaining}</span>
        </p>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">
          Desvantagens (até 5, {disCount}/5 selecionadas) — cada uma concede XP:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {DISADVANTAGES.map((d) => {
            const isChecked = disSel.has(d.key);
            return (
              <div key={d.key} className="rounded-md border border-border bg-surface p-2 text-xs">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    name={`dis_${d.key}`}
                    checked={isChecked}
                    disabled={!isChecked && disCount >= 5}
                    onChange={(e) => {
                      const next = new Map(disSel);
                      if (e.target.checked) next.set(d.key, false);
                      else next.delete(d.key);
                      setDisSel(next);
                    }}
                  />
                  {d.name} (+{d.cost} XP)
                </label>
                {isChecked && d.maxTimes === 2 && (
                  <label className="ml-6 flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={`dis_${d.key}_2x`}
                      checked={disSel.get(d.key) ?? false}
                      onChange={(e) => {
                        const next = new Map(disSel);
                        next.set(d.key, e.target.checked);
                        setDisSel(next);
                      }}
                    />
                    2x: {d.repeatName} (+{d.repeatCost} XP)
                  </label>
                )}
                <p className="mt-1 text-foreground/60">{d.summary}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">Vantagens — cada uma custa XP:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ADVANTAGES.map((a) => {
            const isChecked = advSel.has(a.key);
            return (
              <div key={a.key} className="rounded-md border border-border bg-surface p-2 text-xs">
                <label className="flex items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    name={`adv_${a.key}`}
                    checked={isChecked}
                    onChange={(e) => {
                      const next = new Map(advSel);
                      if (e.target.checked) next.set(a.key, false);
                      else next.delete(a.key);
                      setAdvSel(next);
                    }}
                  />
                  {a.name} (−{a.cost} XP){a.creationOnly ? " *" : ""}
                </label>
                {isChecked && a.maxTimes === 2 && (
                  <label className="ml-6 flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={`adv_${a.key}_2x`}
                      checked={advSel.get(a.key) ?? false}
                      onChange={(e) => {
                        const next = new Map(advSel);
                        next.set(a.key, e.target.checked);
                        setAdvSel(next);
                      }}
                    />
                    2x: {a.repeatName} (−{a.repeatCost} XP)
                  </label>
                )}
                <p className="mt-1 text-foreground/60">{a.summary}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-1 text-xs text-foreground/50">* só pode ser adquirida na Criação.</p>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium">
          Melhorar um Domínio (10 XP por nível, p.193):
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {DOMAINS.map((d) => (
            <label key={d.key} className="flex items-center justify-between gap-2 text-xs">
              {d.name} (atual: {currentDomainRatings[d.key] ?? 0})
              <input
                type="number"
                name={`dspend_${d.key}`}
                min={0}
                max={5}
                value={domainLevels[d.key] ?? 0}
                onChange={(e) =>
                  setDomainLevels((prev) => ({ ...prev, [d.key]: Number(e.target.value) || 0 }))
                }
                className="w-14 rounded-md border border-border bg-background px-1 py-0.5"
              />
            </label>
          ))}
        </div>
      </div>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || remaining < 0}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
