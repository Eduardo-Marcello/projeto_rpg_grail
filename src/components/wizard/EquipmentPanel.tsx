"use client";

import { useState, useTransition } from "react";
import {
  addEquipmentItemAction,
  removeEquipmentItemAction,
  confirmEquipmentStepAction,
} from "@/lib/actions/character";
import { EQUIPMENT, type EquipmentCategory } from "@/lib/game-data/equipment";

const CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  EVERYDAY: "Itens do Dia a Dia",
  MEDICINE: "Medicina",
  SERVICE: "Serviços",
  WEAPON: "Armas",
  ARMOR: "Armaduras",
  SHIELD: "Escudos e Amuletos",
  WYRDNESS_PROTECTION: "Proteções contra a Wyrdness",
};

function itemType(category: EquipmentCategory): "WEAPON" | "ARMOR" | "EQUIPMENT" {
  if (category === "WEAPON") return "WEAPON";
  if (category === "ARMOR" || category === "SHIELD") return "ARMOR";
  return "EQUIPMENT";
}

export function EquipmentPanel({
  characterId,
  riches,
  items,
}: {
  characterId: string;
  riches: number;
  items: { id: string; name: string; stats: unknown }[];
}) {
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState<EquipmentCategory>("WEAPON");

  const categories = Object.keys(CATEGORY_LABELS) as EquipmentCategory[];
  const itemsInCategory = EQUIPMENT.filter((e) => e.category === category);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg font-semibold">Riquezas restantes: {riches}</p>

      <div>
        <p className="mb-2 text-sm font-medium">Inventário atual:</p>
        {items.length === 0 ? (
          <p className="text-sm text-foreground/60">Nenhum item ainda.</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-1.5 text-sm"
              >
                {item.name}
                {(item.stats as { free?: boolean } | null)?.free ? null : (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => removeEquipmentItemAction(characterId, item.id))
                    }
                    className="text-xs text-accent"
                  >
                    remover
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={
              "rounded-md px-3 py-1 text-sm " +
              (c === category
                ? "bg-accent text-accent-foreground"
                : "border border-border text-foreground/70")
            }
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {itemsInCategory.map((item) => (
          <li
            key={item.key}
            className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface p-3 text-sm"
          >
            <div>
              <p className="font-medium">
                {item.name} ({item.cost} riqueza{item.cost !== 1 ? "s" : ""})
              </p>
              <p className="text-xs text-foreground/60">{item.summary}</p>
            </div>
            <button
              type="button"
              disabled={isPending || riches < item.cost}
              onClick={() =>
                startTransition(() =>
                  addEquipmentItemAction(
                    characterId,
                    item.key,
                    item.cost,
                    itemType(item.category),
                    item.name,
                  ),
                )
              }
              className="shrink-0 rounded-md border border-accent px-2 py-1 text-xs text-accent disabled:opacity-40"
            >
              comprar
            </button>
          </li>
        ))}
      </ul>

      <form action={confirmEquipmentStepAction.bind(null, characterId)}>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
