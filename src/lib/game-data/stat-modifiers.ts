// Modificadores de Vantagens/Desvantagens que alteram diretamente um valor
// numérico base da ficha (Vigor, Resistência Mental, Velocidade, Defesa,
// Pontos de Sobrevivência) — usados na Etapa 9 (Other Attributes, p.201-203)
// para calcular os valores finais. Vantagens/Desvantagens que dão bônus a
// ROLAGENS específicas (ex: +2 em Cura) não entram aqui — isso é
// responsabilidade da mesa de rolagem (Fase 4), não da ficha em si.
//
// "perExtraTime" é aplicado para cada vez além da primeira (ex.: Arthritis
// tomada 2x aplica base uma vez + perExtraTime uma vez).

import type { AdvantageKey } from "./advantages";
import type { DisadvantageKey } from "./disadvantages";

export interface StatDelta {
  stamina?: number;
  mentalResistance?: number;
  survivalPoints?: number;
  speed?: number;
  defense?: number;
}

export const ADVANTAGE_STAT_MODIFIERS: Partial<
  Record<AdvantageKey, { base: StatDelta; perExtraTime?: StatDelta }>
> = {
  ALLMOTHERS_FAVOR: { base: { survivalPoints: 1 } },
  STRONG_MIND: { base: { mentalResistance: 1 }, perExtraTime: { mentalResistance: 1 } },
};

export const DISADVANTAGE_STAT_MODIFIERS: Partial<
  Record<DisadvantageKey, { base: StatDelta; perExtraTime?: StatDelta }>
> = {
  GODFORSAKEN: { base: { survivalPoints: -1 } },
  ARTHRITIS: { base: { speed: -1 }, perExtraTime: { speed: -1 } },
  CLUMSY: { base: { defense: -1 }, perExtraTime: { defense: -1 } },
  RATTLED: { base: { mentalResistance: -1 }, perExtraTime: { mentalResistance: -1 } },
  WEAKENED: { base: { stamina: -1 }, perExtraTime: { stamina: -1 } },
};

export interface Selection<K extends string> {
  key: K;
  times: number;
}

export function sumStatDeltas(
  advantages: Selection<AdvantageKey>[],
  disadvantages: Selection<DisadvantageKey>[],
): StatDelta {
  const total: StatDelta = {};
  const add = (delta?: StatDelta) => {
    if (!delta) return;
    for (const k of Object.keys(delta) as (keyof StatDelta)[]) {
      total[k] = (total[k] ?? 0) + (delta[k] ?? 0);
    }
  };

  for (const sel of advantages) {
    const mod = ADVANTAGE_STAT_MODIFIERS[sel.key];
    if (!mod) continue;
    add(mod.base);
    for (let i = 1; i < sel.times; i++) add(mod.perExtraTime);
  }
  for (const sel of disadvantages) {
    const mod = DISADVANTAGE_STAT_MODIFIERS[sel.key];
    if (!mod) continue;
    add(mod.base);
    for (let i = 1; i < sel.times; i++) add(mod.perExtraTime);
  }

  return total;
}
