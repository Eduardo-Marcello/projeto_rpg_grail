// Os Domínios da ficha oficial — corebook p.390 (Character Sheet).
// domainKey usa a chave em inglês do livro para bater com a nomenclatura
// oficial; "name" é a tradução em português usada na interface.

import type { WayKey } from "./ways";

export type DomainKey =
  | "LEADERSHIP"
  | "INSPIRATION"
  | "COMPASSION"
  | "RELIGION"
  | "STEALTH"
  | "PERCEPTION"
  | "MONSTERS"
  | "TRAVEL"
  | "CLOSE_COMBAT"
  | "FEATS"
  | "MOUNTED_COMBAT"
  | "SHOOT_THROW"
  | "CRAFT"
  | "WYRDNESS_MYSTERIES"
  | "COMMUNICATION"
  | "PERFORMANCE"
  | "ERUDITION"
  | "NATURAL_ENVIRONMENT"
  | "MAGIC"
  | "HEALING";

export interface DomainDef {
  key: DomainKey;
  name: string;
  way: WayKey;
}

export const DOMAINS: DomainDef[] = [
  { key: "LEADERSHIP", name: "Liderança", way: "CONVICTION" },
  { key: "INSPIRATION", name: "Inspiração", way: "CONVICTION" },
  { key: "COMPASSION", name: "Compaixão", way: "CONVICTION" },
  { key: "RELIGION", name: "Religião", way: "CONVICTION" },
  { key: "STEALTH", name: "Furtividade", way: "AWARENESS" },
  { key: "PERCEPTION", name: "Percepção", way: "AWARENESS" },
  { key: "MONSTERS", name: "Monstros", way: "AWARENESS" },
  { key: "TRAVEL", name: "Viagem", way: "REASON" },
  { key: "CLOSE_COMBAT", name: "Combate Corpo a Corpo", way: "COMBATIVENESS" },
  { key: "FEATS", name: "Proezas", way: "COMBATIVENESS" },
  { key: "MOUNTED_COMBAT", name: "Combate Montado", way: "COMBATIVENESS" },
  { key: "SHOOT_THROW", name: "Tiro e Lançamento", way: "COMBATIVENESS" },
  { key: "CRAFT", name: "Ofício", way: "CREATIVITY" },
  { key: "WYRDNESS_MYSTERIES", name: "Mistérios da Wyrdness", way: "CREATIVITY" },
  { key: "COMMUNICATION", name: "Comunicação", way: "CREATIVITY" },
  { key: "PERFORMANCE", name: "Performance", way: "CREATIVITY" },
  { key: "ERUDITION", name: "Erudição", way: "REASON" },
  { key: "NATURAL_ENVIRONMENT", name: "Ambiente Natural", way: "REASON" },
  { key: "MAGIC", name: "Magia", way: "REASON" },
  { key: "HEALING", name: "Cura", way: "REASON" },
];

export function getDomain(key: DomainKey): DomainDef {
  const domain = DOMAINS.find((d) => d.key === key);
  if (!domain) throw new Error(`Domínio desconhecido: ${key}`);
  return domain;
}

export function domainsForWay(way: WayKey): DomainDef[] {
  return DOMAINS.filter((d) => d.way === way);
}
