"use client";

import { useRouter } from "next/navigation";

export function CharacterSelect({
  characters,
  selectedId,
}: {
  characters: { id: string; name: string | null }[];
  selectedId: string;
}) {
  const router = useRouter();

  return (
    <label className="flex flex-col gap-1 text-sm">
      Personagem
      <select
        className="w-fit rounded-md border border-border bg-background px-2 py-1.5"
        defaultValue={selectedId}
        onChange={(e) => router.push(`/mesa?personagem=${e.target.value}`)}
      >
        {characters.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name ?? "(sem nome)"}
          </option>
        ))}
      </select>
    </label>
  );
}
