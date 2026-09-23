"use client";

import { useState, useTransition } from "react";
import { addSkillAction, removeSkillAction } from "@/lib/actions/monsters";

export function SkillsEditor({
  monsterId,
  skills,
}: {
  monsterId: string;
  skills: { name: string; rating: number }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [rating, setRating] = useState("0");

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-semibold">Domínios/Disciplinas relevantes</h3>
        <p className="text-xs text-foreground/60">
          Lista livre de perícias que o monstro/NPC usa em rolagens de Resolução — p.368 (ex:
          &ldquo;Percepção: 10&rdquo;, &ldquo;Furtividade: 8&rdquo;).
        </p>
      </div>

      {skills.length === 0 ? (
        <p className="text-sm text-foreground/60">Nenhuma ainda.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <li
              key={i}
              className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
            >
              {skill.name}: {skill.rating}
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(async () => await removeSkillAction(monsterId, i))}
                className="text-xs text-red-600"
              >
                remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-end gap-2 rounded-md border border-dashed border-border p-3">
        <label className="flex flex-col gap-1 text-xs">
          Nome
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          Rating
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-20 rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          disabled={isPending || !name.trim()}
          onClick={() =>
            startTransition(async () => {
              await addSkillAction(monsterId, name, Number(rating));
              setName("");
              setRating("0");
            })
          }
          className="rounded-md border border-accent px-3 py-1.5 text-xs text-accent disabled:opacity-40"
        >
          adicionar
        </button>
      </div>
    </div>
  );
}
