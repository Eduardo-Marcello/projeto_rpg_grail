import { requireOwnedCharacter } from "@/lib/dal";
import { enforceStepAccess } from "@/lib/character-wizard";
import { prisma } from "@/lib/db";
import { confirmAttributesAction } from "@/lib/actions/character";
import {
  computeDefense,
  computeMentalResistance,
  computePotential,
  computeSpeed,
  BASE_STAMINA,
  BASE_SURVIVAL_POINTS,
} from "@/lib/character-calc";
import { sumStatDeltas, type Selection } from "@/lib/game-data/stat-modifiers";
import { fromJson } from "@/lib/character-domains";
import type { Way } from "@/generated/prisma/enums";
import type { AdvantageKey } from "@/lib/game-data/advantages";
import type { DisadvantageKey } from "@/lib/game-data/disadvantages";

export default async function Step9Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  enforceStepAccess(character, 9);
  const ways = await prisma.characterWay.findMany({ where: { characterId: character.id } });
  const rating = (way: Way) => ways.find((w) => w.way === way)?.rating ?? 0;

  const potential = computePotential(rating("CREATIVITY"));
  const defense = computeDefense(rating("AWARENESS"), rating("REASON"));
  const speed = computeSpeed(rating("AWARENESS"), rating("COMBATIVENESS"));
  const mentalResistance = computeMentalResistance(rating("CONVICTION"));
  const delta = sumStatDeltas(
    fromJson<Selection<AdvantageKey>[]>(character.advantages, []),
    fromJson<Selection<DisadvantageKey>[]>(character.disadvantages, []),
  );

  const rows: [string, number, string][] = [
    ["Potencial de Luta", potential, "conforme Criatividade"],
    ["Defesa", defense + (delta.defense ?? 0), "Consciência + Razão + 5"],
    ["Velocidade", speed + (delta.speed ?? 0), "Consciência + Combatividade"],
    ["Vigor", BASE_STAMINA + (delta.stamina ?? 0), "base 10"],
    [
      "Resistência Mental",
      mentalResistance + (delta.mentalResistance ?? 0),
      "Convicção + 5",
    ],
    [
      "Pontos de Sobrevivência",
      BASE_SURVIVAL_POINTS + (delta.survivalPoints ?? 0),
      "base 3",
    ],
    ["Pontos de Magia", 0, "só ao adquirir a 1ª Disciplina de Magia (p.203)"],
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Etapa 9: Outros Atributos</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Calculados a partir das Vias e ajustados pelas Vantagens e
          Desvantagens escolhidas na Etapa 6 (p.201-203).
        </p>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([label, value, note]) => (
            <tr key={label} className="border-b border-border">
              <td className="py-2 font-medium">{label}</td>
              <td className="py-2 text-right font-mono">{value}</td>
              <td className="py-2 pl-4 text-xs text-foreground/60">{note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-foreground/50">
        A tabela de Condição de Saúde (Good/Okay/Bad/Critical/Agony) e o
        rastreio detalhado de dano ficam para a Fase 2, quando a ficha
        completa puder ser visualizada e editada.
      </p>
      <form action={confirmAttributesAction.bind(null, character.id)}>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
        >
          Confirmar e continuar
        </button>
      </form>
    </div>
  );
}
