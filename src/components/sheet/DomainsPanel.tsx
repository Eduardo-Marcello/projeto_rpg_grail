"use client";

import { useState, useTransition } from "react";
import {
  addDisciplineAction,
  removeDisciplineAction,
  spendXpOnDomainAction,
} from "@/lib/actions/character-sheet";
import { getDomain, type DomainKey } from "@/lib/game-data/domains";

interface DomainRow {
  domainKey: string;
  rating: number;
  bonus: number;
  penalty: number;
  disciplines: { name: string; rating: number }[];
}

export function DomainsPanel({
  characterId,
  domains,
  experience,
}: {
  characterId: string;
  domains: DomainRow[];
  experience: number;
}) {
  const [isPending, startTransition] = useTransition();
  const sorted = [...domains].sort((a, b) => b.rating - a.rating);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-foreground/60">
        Experiência disponível: <strong>{experience} XP</strong> — melhorar um Domínio custa 10
        XP/nível (p.193).
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {sorted
          // Um Domínio com rating 0 mas com Disciplinas registradas (ver
          // recomputeDomains, character-domains.ts) continua aparecendo —
          // senão a Disciplina fica salva mas inacessível na ficha.
          .filter((d) => d.rating > 0 || d.disciplines.length > 0)
          .map((d) => (
            <DomainCard
              key={d.domainKey}
              characterId={characterId}
              domain={d}
              experience={experience}
              isPending={isPending}
              startTransition={startTransition}
            />
          ))}
      </div>
    </div>
  );
}

function DomainCard({
  characterId,
  domain,
  experience,
  isPending,
  startTransition,
}: {
  characterId: string;
  domain: DomainRow;
  experience: number;
  isPending: boolean;
  startTransition: (fn: () => void) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState(1);
  const def = getDomain(domain.domainKey as DomainKey);

  return (
    <div className="rounded-md border border-border bg-surface p-3 text-sm">
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          {def.name}: {domain.rating}
          {domain.bonus ? ` +${domain.bonus}` : ""}
          {domain.penalty ? ` -${domain.penalty}` : ""}
        </span>
        <button
          type="button"
          disabled={isPending || experience < 10}
          onClick={() => startTransition(() => spendXpOnDomainAction(characterId, domain.domainKey))}
          className="rounded border border-accent px-2 py-0.5 text-xs text-accent disabled:opacity-40"
          title="Gastar 10 XP para +1 nível"
        >
          +1 nível (10 XP)
        </button>
      </div>

      <ul className="mt-1 flex flex-col gap-0.5">
        {domain.disciplines.map((disc, i) => (
          <li key={i} className="flex items-center justify-between text-xs text-foreground/70">
            <span>
              · {disc.name}: {disc.rating}
            </span>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                startTransition(() => removeDisciplineAction(characterId, domain.domainKey, i))
              }
              className="text-foreground/40 hover:text-red-600"
            >
              remover
            </button>
          </li>
        ))}
      </ul>

      {domain.disciplines.length < 3 && (
        <div className="mt-2 flex items-center gap-1">
          <input
            type="text"
            placeholder="Nova Disciplina"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="min-w-0 flex-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs"
          />
          <input
            type="number"
            min={1}
            max={10}
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value) || 1)}
            className="w-12 rounded border border-border bg-background px-1 py-0.5 text-xs"
          />
          <button
            type="button"
            disabled={isPending || !newName.trim()}
            onClick={() =>
              startTransition(async () => {
                await addDisciplineAction(characterId, domain.domainKey, newName, newRating);
                setNewName("");
                setNewRating(1);
              })
            }
            className="rounded border border-border px-2 py-0.5 text-xs disabled:opacity-40"
          >
            add
          </button>
        </div>
      )}
    </div>
  );
}
