"use client";

import { updateStoryArcAction } from "@/lib/actions/character-sheet";

export function StoryArcEditForm({
  characterId,
  quest,
  acts,
}: {
  characterId: string;
  quest: string;
  acts: string[];
}) {
  return (
    <form action={updateStoryArcAction.bind(null, characterId)} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        Quest
        <textarea
          name="quest"
          defaultValue={quest}
          rows={2}
          className="rounded-md border border-border bg-background px-3 py-2"
        />
      </label>
      {[0, 1, 2].map((i) => (
        <label key={i} className="flex flex-col gap-1 text-sm">
          Ato {i + 1}
          <textarea
            name={`act${i + 1}`}
            defaultValue={acts[i] ?? ""}
            rows={2}
            className="rounded-md border border-border bg-background px-3 py-2"
          />
        </label>
      ))}
      <button
        type="submit"
        className="self-start rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
      >
        Salvar
      </button>
    </form>
  );
}
