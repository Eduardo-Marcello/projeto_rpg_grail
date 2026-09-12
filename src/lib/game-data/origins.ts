// Etapa 2: Origin (Origem) — corebook p.165-167.
// Fonte: reference/corebook_fulltext.txt, páginas 165-167.
// Cada Origem concede +1 nível em um Domínio associado à Via indicada
// (a escolha de QUAL domínio é do jogador, entre os domínios daquela Via).

import type { WayKey } from "./ways";

export type OriginKey = "HINTERLANDS" | "NORTH" | "SOUTH" | "MISTS" | "CONTINENT";

export interface OriginDef {
  key: OriginKey;
  name: string;
  summary: string;
  bonusWay: WayKey;
}

export const ORIGINS: OriginDef[] = [
  {
    key: "HINTERLANDS",
    name: "Povo do Interior",
    summary:
      "Comunidades que resistiram na charneca inóspita de Avalon, à custa de luta e sacrifício, unidas por princípios de ajuda mútua.",
    bonusWay: "COMBATIVENESS",
  },
  {
    key: "NORTH",
    name: "Povo do Norte",
    summary:
      "Moldado pelo clima hostil do extremo norte da ilha, um povo resiliente e de mente forte, isolado de Kamelot e protetor de sua independência.",
    bonusWay: "CONVICTION",
  },
  {
    key: "SOUTH",
    name: "Povo do Sul",
    summary:
      "A ponta sul de Avalon recebe a maioria dos que chegam pelo mar — um caldeirão de clãs e comunidades unidas para sobreviver à Wyrdness.",
    bonusWay: "AWARENESS",
  },
  {
    key: "MISTS",
    name: "Povo das Névoas",
    summary:
      "Após a Queda de Avalon, alguns não tiveram escolha além de se entregar à neblina — sobreviveram, mas com metabolismos e mentes irremediavelmente alterados.",
    bonusWay: "CREATIVITY",
  },
  {
    key: "CONTINENT",
    name: "Povo do Continente",
    summary:
      "Um personagem nascido fora de Avalon (com aprovação do mestre), vindo de uma terra abandonada, arruinada pela Morte Vermelha.",
    bonusWay: "REASON",
  },
];

export function getOrigin(key: OriginKey): OriginDef {
  const origin = ORIGINS.find((o) => o.key === key);
  if (!origin) throw new Error(`Origem desconhecida: ${key}`);
  return origin;
}
