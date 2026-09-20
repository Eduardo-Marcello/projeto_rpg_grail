// Formato da ficha de Monstro/NPC — corebook p.367-369 ("How the Bestiary
// Works" e "Creature Statistics"), a mesma estrutura usada em cada entrada
// do Bestiário oficial (p.370+): Visão geral, Descrição, Traços, Habilidades
// Especiais e as Estatísticas (Ataque/Dano/Defesa/Proteção/Velocidade/
// Potencial, Saúde/Vigor/Resistência Mental, e uma lista livre de Domínios
// relevantes ao monstro, ex: Percepção, Furtividade, Proezas).

export interface MonsterStats {
  overview: string;
  description: string;
  traits: { name: string; description: string }[];
  specialAbilities: { name: string; description: string }[];
  attack: number;
  weaponLabel: string;
  damage: number;
  defense: number;
  protection: number;
  speed: number;
  potential: number;
  // Limiares de Saúde do monstro (p.368: ex. "15/10/5/3") — quantidade de
  // níveis varia por criatura, ao contrário dos 19 boxes fixos da ficha de
  // jogador (ver src/lib/health.ts).
  health: number[];
  stamina: number;
  mentalResistance: number;
  // Domínios/Disciplinas relevantes ao monstro (ex: "Percepção: 10").
  skills: { name: string; rating: number }[];
}

export const EMPTY_MONSTER_STATS: MonsterStats = {
  overview: "",
  description: "",
  traits: [],
  specialAbilities: [],
  attack: 0,
  weaponLabel: "",
  damage: 0,
  defense: 0,
  protection: 0,
  speed: 0,
  potential: 0,
  health: [],
  stamina: 0,
  mentalResistance: 0,
  skills: [],
};
