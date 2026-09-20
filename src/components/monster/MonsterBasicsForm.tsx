"use client";

import { useTransition } from "react";
import { updateMonsterBasicsAction } from "@/lib/actions/monsters";

export function MonsterBasicsForm({
  monsterId,
  name,
  wyrdnessLevel,
  overview,
  description,
  notes,
}: {
  monsterId: string;
  name: string;
  wyrdnessLevel: number | null;
  overview: string;
  description: string;
  notes: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-col gap-3"
      action={(formData) => startTransition(() => updateMonsterBasicsAction(monsterId, formData))}
    >
      <label className="flex flex-col gap-1 text-sm">
        Nome
        <input
          name="name"
          defaultValue={name}
          className="rounded-md border border-border bg-background px-2 py-1.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Nível de Wyrdness (0-4, p.367)
        <input
          name="wyrdnessLevel"
          type="number"
          min={0}
          max={4}
          defaultValue={wyrdnessLevel ?? ""}
          className="w-24 rounded-md border border-border bg-background px-2 py-1.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Visão geral (texto ambiente)
        <textarea
          name="overview"
          defaultValue={overview}
          rows={3}
          className="rounded-md border border-border bg-background px-2 py-1.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Descrição (comportamento e armas)
        <textarea
          name="description"
          defaultValue={description}
          rows={2}
          className="rounded-md border border-border bg-background px-2 py-1.5"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Notas do Mestre (privado, não é regra do livro)
        <textarea
          name="notes"
          defaultValue={notes ?? ""}
          rows={2}
          className="rounded-md border border-border bg-background px-2 py-1.5"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        {isPending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
