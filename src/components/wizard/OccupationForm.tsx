"use client";

import { useActionState, useMemo, useState } from "react";
import { saveOccupationAction, type StepFormState } from "@/lib/actions/character";
import { OCCUPATIONS, type OccupationKey } from "@/lib/game-data/occupations";
import { DOMAINS, getDomain, type DomainKey } from "@/lib/game-data/domains";

type PursuitLevel = 0 | 1 | 2;

export function OccupationForm({
  characterId,
  currentOccupation,
  currentSecondary,
  currentTertiary,
  currentPlus2,
  currentPlus1,
}: {
  characterId: string;
  currentOccupation: string | null;
  currentSecondary: string | null;
  currentTertiary: string | null;
  currentPlus2: string[];
  currentPlus1: string[];
}) {
  const action = saveOccupationAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<StepFormState, FormData>(
    action,
    undefined,
  );
  const [occKey, setOccKey] = useState<OccupationKey | null>(
    (currentOccupation as OccupationKey) ?? null,
  );
  const occ = occKey ? OCCUPATIONS.find((o) => o.key === occKey)! : null;

  const [secondary, setSecondary] = useState<DomainKey | null>(
    (currentSecondary as DomainKey) ?? null,
  );
  const [tertiary, setTertiary] = useState<DomainKey | null>(
    (currentTertiary as DomainKey) ?? null,
  );

  const initialPursuits = useMemo(() => {
    const map: Partial<Record<DomainKey, PursuitLevel>> = {};
    for (const d of currentPlus2) map[d as DomainKey] = 2;
    for (const d of currentPlus1) map[d as DomainKey] = 1;
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [pursuits, setPursuits] = useState<Partial<Record<DomainKey, PursuitLevel>>>(
    initialPursuits,
  );

  // Domínios que a Ocupação já tocou (Primário fixo + Secundário/Terciário
  // escolhidos) — nunca aparecem na lista de Outras Vivências.
  const touched = useMemo(
    () => new Set<DomainKey>(occ ? [occ.primary, secondary, tertiary].filter(Boolean) as DomainKey[] : []),
    [occ, secondary, tertiary],
  );
  const pursuitOptions = useMemo(
    () => DOMAINS.filter((d) => !touched.has(d.key)),
    [touched],
  );

  const plus2Count = Object.values(pursuits).filter((v) => v === 2).length;
  const plus1Count = Object.values(pursuits).filter((v) => v === 1).length;

  function setPursuit(domain: DomainKey, level: PursuitLevel) {
    setPursuits((prev) => ({ ...prev, [domain]: level }));
  }

  // Se o Domínio escolhido agora como Secundário/Terciário já tinha uma
  // seleção em Outras Vivências, ela precisa sumir junto — senão ela some da
  // lista visível (pursuitOptions filtra Domínios "touched") mas continua
  // contando em plus2Count/plus1Count, deixando o botão "Continuar"
  // liberado com uma contagem que o servidor não vê (e rejeita).
  function clearStalePursuit(domain: DomainKey) {
    setPursuits((prev) => {
      if (!(domain in prev)) return prev;
      const next = { ...prev };
      delete next[domain];
      return next;
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label className="mb-2 block text-sm font-medium">Ocupação</label>
        <select
          name="occupation"
          value={occKey ?? ""}
          onChange={(e) => {
            setOccKey(e.target.value as OccupationKey);
            setSecondary(null);
            setTertiary(null);
            setPursuits({});
          }}
          required
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Escolha uma ocupação
          </option>
          {OCCUPATIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.name}
            </option>
          ))}
        </select>
        {occ && <p className="mt-2 text-sm text-foreground/70">{occ.summary}</p>}
      </div>

      {occ && (
        <>
          <div className="rounded-md border border-border bg-surface p-4 text-sm">
            <p>
              Domínio Primário (5 pontos): <strong>{getDomain(occ.primary).name}</strong>
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Domínio Secundário (3 pontos) — escolha um:</p>
            <div className="flex flex-wrap gap-2">
              {occ.secondaryOptions.map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm has-checked:border-accent"
                >
                  <input
                    type="radio"
                    name="secondary"
                    value={d}
                    checked={secondary === d}
                    onChange={() => {
                      setSecondary(d);
                      clearStalePursuit(d);
                    }}
                    required
                  />
                  {getDomain(d).name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Domínio Terciário (1 ponto) — escolha um:</p>
            <div className="flex flex-wrap gap-2">
              {occ.tertiaryOptions.map((d) => (
                <label
                  key={d}
                  className="flex items-center gap-1 rounded-md border border-border bg-surface px-3 py-1.5 text-sm has-checked:border-accent"
                >
                  <input
                    type="radio"
                    name="tertiary"
                    value={d}
                    checked={tertiary === d}
                    onChange={() => {
                      setTertiary(d);
                      clearStalePursuit(d);
                    }}
                    required
                  />
                  {getDomain(d).name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-sm font-medium">Outras Vivências (p.179)</p>
            <p className="mb-2 text-xs text-foreground/60">
              Escolha 2 Domínios (ainda não tocados pela Ocupação) para +2
              pontos cada, e outros 2 Domínios distintos para +1 ponto cada.
              Domínios já usados pela Ocupação não aparecem aqui.
            </p>
            <p className="mb-2 text-sm">
              +2 selecionados:{" "}
              <span className={plus2Count === 2 ? "text-accent" : "font-semibold text-red-600"}>
                {plus2Count}/2
              </span>
              {"  ·  "}
              +1 selecionados:{" "}
              <span className={plus1Count === 2 ? "text-accent" : "font-semibold text-red-600"}>
                {plus1Count}/2
              </span>
            </p>
            <div className="grid gap-1 sm:grid-cols-2">
              {pursuitOptions.map((d) => {
                const level = pursuits[d.key] ?? 0;
                return (
                  <div
                    key={d.key}
                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
                  >
                    <span>{d.name}</span>
                    <div className="flex gap-1 text-xs">
                      {([0, 1, 2] as PursuitLevel[]).map((lvl) => (
                        <label
                          key={lvl}
                          className={
                            "cursor-pointer rounded border px-2 py-0.5 " +
                            (level === lvl
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border text-foreground/60")
                          }
                        >
                          <input
                            type="radio"
                            name={`pursuit_${d.key}`}
                            value={lvl}
                            checked={level === lvl}
                            onChange={() => setPursuit(d.key, lvl)}
                            className="sr-only"
                          />
                          {lvl === 0 ? "—" : `+${lvl}`}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || !occ || !secondary || !tertiary || plus2Count !== 2 || plus1Count !== 2}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
