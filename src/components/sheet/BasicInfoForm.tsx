"use client";

import { updateBasicInfoAction } from "@/lib/actions/character-sheet";

export function BasicInfoForm({
  characterId,
  name,
  personality,
  background,
  description,
}: {
  characterId: string;
  name: string | null;
  personality: string | null;
  background: string | null;
  description: string | null;
}) {
  return (
    <form action={updateBasicInfoAction.bind(null, characterId)} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Nome
        <input
          type="text"
          name="name"
          defaultValue={name ?? ""}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Personalidade
        <textarea
          name="personality"
          defaultValue={personality ?? ""}
          rows={3}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        História
        <textarea
          name="background"
          defaultValue={background ?? ""}
          rows={4}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Descrição física
        <textarea
          name="description"
          defaultValue={description ?? ""}
          rows={3}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>
      <button
        type="submit"
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        Salvar
      </button>
    </form>
  );
}
