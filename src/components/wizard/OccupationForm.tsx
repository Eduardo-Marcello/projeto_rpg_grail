"use client";

import { useActionState, useMemo, useState } from "react";
import { saveOccupationAction, type StepFormState } from "@/lib/actions/character";
import { OCCUPATIONS, type OccupationKey } from "@/lib/game-data/occupations";
import { DOMAINS, getDomain, type DomainKey } from "@/lib/game-data/domains";

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

  const otherPursuitOptions = useMemo(() => {
    if (!occ) return DOMAINS;
    const touched = new Set<DomainKey>([occ.primary]);
    // Também exclui a lista completa das opções secundárias/terciárias
    // (o domínio finalmente escolhido é excluído; os demais permanecem
    // disponíveis já que Other Pursuits só precisa evitar os TRÊS
    // domínios efetivamente escolhidos pela Ocupação, não as alternativas
    // não escolhidas).
    return DOMAINS.filter((d) => !touched.has(d.key));
  }, [occ]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div>
        <label className="mb-2 block text-sm font-medium">Ocupação</label>
        <select
          name="occupation"
          value={occKey ?? ""}
          onChange={(e) => setOccKey(e.target.value as OccupationKey)}
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
                    defaultChecked={currentSecondary === d}
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
                    defaultChecked={currentTertiary === d}
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
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {["plus2_1", "plus2_2"].map((name, i) => (
                <DomainSelect
                  key={name}
                  name={name}
                  label={`+2 pontos (${i + 1})`}
                  options={otherPursuitOptions}
                  defaultValue={currentPlus2[i]}
                />
              ))}
              {["plus1_1", "plus1_2"].map((name, i) => (
                <DomainSelect
                  key={name}
                  name={name}
                  label={`+1 ponto (${i + 1})`}
                  options={otherPursuitOptions}
                  defaultValue={currentPlus1[i]}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || !occ}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}

function DomainSelect({
  name,
  label,
  options,
  defaultValue,
}: {
  name: string;
  label: string;
  options: { key: DomainKey; name: string }[];
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required
        className="rounded-md border border-border bg-background px-2 py-1"
      >
        <option value="" disabled>
          —
        </option>
        {options.map((d) => (
          <option key={d.key} value={d.key}>
            {d.name}
          </option>
        ))}
      </select>
    </label>
  );
}
