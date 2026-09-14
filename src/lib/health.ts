// Condição de Saúde — corebook p.272-279 (regras) e p.390 (ficha oficial).
// Fonte: reference/corebook_fulltext.txt p.272-279; contagem de caixas
// conferida visualmente na ficha oficial (p.390), que usa 19 caixas no
// total (o texto corrido do capítulo, p.272, diz "17 caixas por padrão" —
// divergência do próprio livro; seguimos a ficha impressa, coerente com
// os exemplos numéricos do texto: 6 de dano = "Razoável", 11 de dano =
// "Ruim").
//
// "Para cada ponto de dano sofrido, o jogador marca uma caixa... a partir
// de 'Razoável' o personagem sofre -1, -2 em 'Ruim', -3 em 'Crítico'.
// Essas penalidades não empilham." (p.274)

export interface HealthTier {
  key: "GOOD" | "OKAY" | "BAD" | "CRITICAL" | "AGONY";
  name: string;
  boxes: number;
  penalty: number;
}

export const HEALTH_TIERS: HealthTier[] = [
  { key: "GOOD", name: "Bem", boxes: 5, penalty: 0 },
  { key: "OKAY", name: "Razoável", boxes: 5, penalty: -1 },
  { key: "BAD", name: "Ruim", boxes: 4, penalty: -2 },
  { key: "CRITICAL", name: "Crítico", boxes: 4, penalty: -3 },
  { key: "AGONY", name: "Agonia", boxes: 1, penalty: -3 },
];

export const HEALTH_TOTAL_BOXES = HEALTH_TIERS.reduce((s, t) => s + t.boxes, 0); // 19

export interface HealthStatus {
  tier: HealthTier;
  penalty: number;
  checked: number;
  total: number;
  inAgony: boolean;
}

// checked: quantas caixas estão marcadas (0 a HEALTH_TOTAL_BOXES), a
// partir de "Bem", da esquerda para a direita. checked=0 (nenhuma
// marcada) e checked=5 (todas as de "Bem" marcadas) são ambos "Bem" —
// só ao marcar a 6ª caixa o personagem entra em "Razoável".
export function getHealthStatus(checked: number): HealthStatus {
  const clamped = Math.max(0, Math.min(checked, HEALTH_TOTAL_BOXES));
  let acc = 0;
  let tier = HEALTH_TIERS[HEALTH_TIERS.length - 1];
  for (const t of HEALTH_TIERS) {
    acc += t.boxes;
    if (clamped <= acc) {
      tier = t;
      break;
    }
  }
  return {
    tier,
    penalty: tier.penalty,
    checked: clamped,
    total: HEALTH_TOTAL_BOXES,
    inAgony: clamped >= HEALTH_TOTAL_BOXES,
  };
}
