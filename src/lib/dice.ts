// Sistema de Resolução e cálculo de Ataque — corebook p.244-257 (Resolution
// System) e p.264 (Attack, Combat System). Paráfrase própria dos exemplos.

export type Stance = "STANDARD" | "OFFENSIVE" | "DEFENSIVE";

// Fonte: p.253 — tabela de Limiares de Dificuldade.
export const DIFFICULTY_THRESHOLDS = [
  { level: "Fácil", value: 8 },
  { level: "Padrão", value: 11 },
  { level: "Complicado", value: 14 },
  { level: "Difícil", value: 17 },
  { level: "Muito Difícil", value: 20 },
  { level: "Excepcional", value: 25 },
  { level: "Heroico", value: 30 },
  { level: "Sobre-humano", value: 35 },
] as const;

interface D10Result {
  first: number;
  reroll?: number;
  outcome: "NORMAL" | "CRITICAL_SUCCESS" | "CRITICAL_FAILURE";
  // Valor efetivamente somado à rolagem: 15 em sucesso crítico confirmado
  // (p.256 — "the die is considered to have rolled a 15"), senão o valor
  // da primeira rolagem.
  faceValue: number;
}

function rollD10(): number {
  return Math.floor(Math.random() * 10) + 1;
}

// Sucesso crítico (10 natural) e falha crítica (1 natural) exigem uma
// segunda rolagem de confirmação; só repetir o mesmo resultado confirma o
// crítico (p.256-257).
function rollResolutionDie(): D10Result {
  const first = rollD10();
  if (first === 10) {
    const reroll = rollD10();
    return reroll === 10
      ? { first, reroll, outcome: "CRITICAL_SUCCESS", faceValue: 15 }
      : { first, reroll, outcome: "NORMAL", faceValue: first };
  }
  if (first === 1) {
    const reroll = rollD10();
    return reroll === 1
      ? { first, reroll, outcome: "CRITICAL_FAILURE", faceValue: first }
      : { first, reroll, outcome: "NORMAL", faceValue: first };
  }
  return { first, outcome: "NORMAL", faceValue: first };
}

function dieText(die: D10Result): string {
  if (die.outcome === "CRITICAL_SUCCESS") return "10, confirmado no reteste — crítico, vale 15";
  if (die.outcome === "CRITICAL_FAILURE") return "1, confirmado no reteste — falha crítica";
  if (die.reroll != null) return `${die.first} (não confirmado — reteste deu ${die.reroll})`;
  return `${die.first}`;
}

// --- /teste — Resolution roll genérico (p.247: Domínio/Disciplina + Via + 1D10) ---

export interface ResolutionRollInput {
  skillLabel: string;
  skillRating: number;
  wayLabel: string;
  wayRating: number;
  difficultyThreshold: number | null;
}

export interface ResolutionRollOutput {
  outcome: D10Result["outcome"];
  total: number;
  success: boolean | null;
  breakdown: string;
}

export function resolveTestRoll(input: ResolutionRollInput): ResolutionRollOutput {
  const die = rollResolutionDie();
  const total = input.skillRating + input.wayRating + die.faceValue;
  const success = input.difficultyThreshold == null ? null : total >= input.difficultyThreshold;
  const parts = [
    `${input.skillLabel} ${input.skillRating}`,
    `${input.wayLabel} ${input.wayRating}`,
    `1D10 (${dieText(die)})`,
  ];
  const resultText =
    success == null
      ? ""
      : success
        ? ` — Sucesso (limiar ${input.difficultyThreshold})`
        : ` — Falha (limiar ${input.difficultyThreshold})`;
  return {
    outcome: die.outcome,
    total,
    success,
    breakdown: `${parts.join(" + ")} = ${total}${resultText}`,
  };
}

// --- /atacar — Attack score (p.264: Combatividade + Domínio/Disciplina de
// luta + modificador de Postura + 1D10). Dano só é conhecido de fato depois
// de subtrair Defesa e Proteção do alvo (p.264), que este app não guarda
// para NPCs — por isso o resultado mostra o total de Ataque e o "dano se
// acertar" (Ataque + dano da arma) para o mestre completar a conta na mesa.

export interface AttackRollInput {
  combativenessLabel: string;
  combativenessRating: number;
  skillLabel: string;
  skillRating: number;
  stance: Stance;
  potential: number;
  weaponLabel: string;
  weaponDamage: number;
}

export interface AttackRollOutput {
  outcome: D10Result["outcome"];
  attackScore: number;
  damageIfHit: number;
  breakdown: string;
}

export function stanceLabel(stance: Stance): string {
  if (stance === "OFFENSIVE") return "Ofensiva";
  if (stance === "DEFENSIVE") return "Defensiva";
  return "Padrão";
}

function stanceAttackModifier(stance: Stance, potential: number): number {
  if (stance === "OFFENSIVE") return potential;
  if (stance === "DEFENSIVE") return -potential;
  return 0;
}

export function resolveAttackRoll(input: AttackRollInput): AttackRollOutput {
  const die = rollResolutionDie();
  const stanceMod = stanceAttackModifier(input.stance, input.potential);
  const attackScore =
    input.combativenessRating + input.skillRating + stanceMod + die.faceValue;
  const damageIfHit = attackScore + input.weaponDamage;
  const stanceText =
    stanceMod === 0 ? "" : ` ${stanceMod > 0 ? "+" : ""}${stanceMod} (Postura ${stanceLabel(input.stance)})`;
  const breakdown =
    `${input.combativenessLabel} ${input.combativenessRating} + ${input.skillLabel} ${input.skillRating}` +
    `${stanceText} + 1D10 (${dieText(die)}) = ${attackScore} de Ataque` +
    ` — dano se acertar: ${attackScore} + ${input.weaponDamage} (${input.weaponLabel}) = ${damageIfHit}` +
    ` menos Defesa e Proteção do alvo`;
  return { outcome: die.outcome, attackScore, damageIfHit, breakdown };
}
