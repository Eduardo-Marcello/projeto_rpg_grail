"use client";

import { useState, useTransition } from "react";

export function NamedListEditor({
  title,
  helpText,
  items,
  onAdd,
  onRemove,
}: {
  title: string;
  helpText: string;
  items: { name: string; description: string }[];
  onAdd: (name: string, description: string) => Promise<void>;
  onRemove: (index: number) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-xs text-foreground/60">{helpText}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-foreground/60">Nenhum ainda.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                {item.description && (
                  <p className="text-foreground/70">{item.description}</p>
                )}
              </div>
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(async () => await onRemove(i))}
                className="shrink-0 text-xs text-red-600"
              >
                remover
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-col gap-2 rounded-md border border-dashed border-border p-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome"
          className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição"
          rows={2}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
        />
        <button
          type="button"
          disabled={isPending || !name.trim()}
          onClick={() =>
            startTransition(async () => {
              await onAdd(name, description);
              setName("");
              setDescription("");
            })
          }
          className="self-start rounded-md border border-accent px-3 py-1.5 text-xs text-accent disabled:opacity-40"
        >
          adicionar
        </button>
      </div>
    </div>
  );
}
