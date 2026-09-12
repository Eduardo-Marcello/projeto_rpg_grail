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
