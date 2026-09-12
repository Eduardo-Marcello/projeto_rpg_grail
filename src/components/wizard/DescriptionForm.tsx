"use client";

import { useActionState, useMemo, useState } from "react";
import { saveDescriptionAction, type StepFormState } from "@/lib/actions/character";
import { QUALITIES, FLAWS, type TraitOption } from "@/lib/game-data/traits";
import type { WayKey } from "@/lib/game-data/ways";

export function DescriptionForm({
  characterId,
  wayLevels,
  currentName,
  currentTraits,
  currentPersonality,
  currentBackground,
  currentDescription,
}: {
  characterId: string;
  wayLevels: Record<WayKey, "high" | "low" | "neutral">;
  currentName: string | null;
  currentTraits: { quality?: TraitOption; flaw?: TraitOption } | null;
  currentPersonality: string | null;
  currentBackground: string | null;
  currentDescription: string | null;
}) {
  const action = saveDescriptionAction.bind(null, characterId);
  const [state, formAction, pending] = useActionState<StepFormState, FormData>(
    action,
    undefined,
  );

  const eligibleQualities = useMemo(
    () => QUALITIES.filter((t) => wayLevels[t.way] === t.level),
    [wayLevels],
  );
  const eligibleFlaws = useMemo(
    () => FLAWS.filter((t) => wayLevels[t.way] === t.level),
    [wayLevels],
  );

  const [qualityIndex, setQualityIndex] = useState(
    currentTraits?.quality
      ? eligibleQualities.findIndex(
          (t) => t.way === currentTraits.quality!.way && t.word === currentTraits.quality!.word,
        )
      : -1,
  );
  const [flawIndex, setFlawIndex] = useState(
    currentTraits?.flaw
      ? eligibleFlaws.findIndex(
          (t) => t.way === currentTraits.flaw!.way && t.word === currentTraits.flaw!.word,
        )
      : -1,
  );

  const quality = qualityIndex >= 0 ? eligibleQualities[qualityIndex] : null;
  const flaw = flawIndex >= 0 ? eligibleFlaws[flawIndex] : null;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        Nome do personagem
        <input
          type="text"
          name="name"
          defaultValue={currentName ?? ""}
          required
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium">Qualidade (Via 4-5)</p>
          <select
            value={qualityIndex}
            onChange={(e) => setQualityIndex(Number(e.target.value))}
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
          >
            <option value={-1} disabled>
              —
            </option>
            {eligibleQualities.map((t, i) => (
              <option key={`${t.way}-${t.word}`} value={i}>
                {t.word}
              </option>
            ))}
          </select>
          {quality && (
            <>
              <input type="hidden" name="qualityWay" value={quality.way} />
              <input type="hidden" name="qualityWord" value={quality.word} />
            </>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Defeito (Via 1-2)</p>
          <select
            value={flawIndex}
            onChange={(e) => setFlawIndex(Number(e.target.value))}
            className="w-full rounded-md border border-border bg-background px-2 py-2 text-sm"
          >
            <option value={-1} disabled>
              —
            </option>
            {eligibleFlaws.map((t, i) => (
              <option key={`${t.way}-${t.word}`} value={i}>
                {t.word}
              </option>
            ))}
          </select>
          {flaw && (
            <>
              <input type="hidden" name="flawWay" value={flaw.way} />
              <input type="hidden" name="flawWord" value={flaw.word} />
            </>
          )}
        </div>
      </div>
      {(eligibleQualities.length === 0 || eligibleFlaws.length === 0) && (
        <p className="text-xs text-foreground/60">
          Nenhum Traço disponível para uma das categorias — isso acontece se
          todas as suas Vias estiverem em 3 (nem alto, nem baixo). Volte à
          Etapa 3 se quiser ajustar.
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Personalidade (p.197)
        <textarea
          name="personality"
          defaultValue={currentPersonality ?? ""}
          rows={3}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        História (p.198)
        <textarea
          name="background"
          defaultValue={currentBackground ?? ""}
          rows={4}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Descrição física (p.199)
        <textarea
          name="description"
          defaultValue={currentDescription ?? ""}
          rows={3}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>

      {state?.message && <p className="text-sm text-red-600">{state.message}</p>}

      <button
        type="submit"
        disabled={pending || !quality || !flaw}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Continuar"}
      </button>
    </form>
  );
}
