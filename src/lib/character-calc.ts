// Fórmulas da Etapa 9: Other Attributes — corebook p.201-203.
// Fonte: reference/corebook_fulltext.txt, páginas 201-203.

export function computePotential(creativity: number): number {
  // Tabela p.201: Criatividade 1 → Potencial 1; 2-4 → 2; 5 → 3.
  if (creativity <= 1) return 1;
  if (creativity <= 4) return 2;
  return 3;
}

export function computeDefense(awareness: number, reason: number): number {
  return awareness + reason + 5;
}

export function computeSpeed(awareness: number, combativeness: number): number {
  return awareness + combativeness;
}

export function computeMentalResistance(conviction: number): number {
  return conviction + 5;
}

export const BASE_STAMINA = 10;
export const BASE_SURVIVAL_POINTS = 3;

// Soma o custo em pontos de Desvantagens de idade obrigatórias (p.181) —
// vive aqui (e não em character-domains.ts) porque este módulo não é
// "server-only" e precisa ser importável tanto pelo servidor (validação em
// saveAgeAction) quanto pelo formulário no cliente (AgeForm), como única
// fonte da fórmula.
export function ageDisadvantageTotal(
  selections: { key: string; times: number }[],
  disadvantageCosts: Record<string, { cost: number; repeatCost?: number }>,
): number {
  return selections.reduce((sum, sel) => {
    const def = disadvantageCosts[sel.key];
    if (!def) return sum;
    let total = def.cost;
    if (sel.times > 1 && def.repeatCost) total += def.repeatCost;
    return sum + total;
  }, 0);
}
