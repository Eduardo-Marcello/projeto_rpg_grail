// Etapa 8: Character Traits (Traços de Personalidade) — corebook p.195-196.
// Fonte: reference/corebook_fulltext.txt, páginas 195-196.
// Todo personagem tem 2 Traços: uma Qualidade e um Defeito. Traços de
// "pontuação alta" só valem para uma Via com nível 4-5; os de "pontuação
// baixa", para uma Via com nível 1-2. Lista não-exaustiva — apenas
// inspiração, conforme o próprio livro.

import type { WayKey } from "./ways";

export interface TraitOption {
  way: WayKey;
  level: "high" | "low";
  word: string;
}

export const QUALITIES: TraitOption[] = [
  { way: "COMBATIVENESS", level: "high", word: "combativo" },
  { way: "COMBATIVENESS", level: "high", word: "corajoso" },
  { way: "COMBATIVENESS", level: "high", word: "otimista" },
  { way: "COMBATIVENESS", level: "high", word: "aguerrido" },
  { way: "COMBATIVENESS", level: "high", word: "vigoroso" },
  { way: "COMBATIVENESS", level: "low", word: "calmo" },
  { way: "COMBATIVENESS", level: "low", word: "equilibrado" },
  { way: "COMBATIVENESS", level: "low", word: "pacífico" },
  { way: "COMBATIVENESS", level: "low", word: "estoico" },
  { way: "CREATIVITY", level: "high", word: "engenhoso" },
  { way: "CREATIVITY", level: "high", word: "divertido" },
  { way: "CREATIVITY", level: "high", word: "inventivo" },
  { way: "CREATIVITY", level: "high", word: "original" },
  { way: "CREATIVITY", level: "high", word: "poético" },
  { way: "CREATIVITY", level: "low", word: "disciplinado" },
  { way: "CREATIVITY", level: "low", word: "tradicionalista" },
  { way: "CREATIVITY", level: "low", word: "sério" },
  { way: "AWARENESS", level: "high", word: "extrovertido" },
  { way: "AWARENESS", level: "high", word: "intuitivo" },
  { way: "AWARENESS", level: "high", word: "empático" },
  { way: "AWARENESS", level: "high", word: "sensível" },
  { way: "AWARENESS", level: "low", word: "imperturbável" },
  { way: "AWARENESS", level: "low", word: "autocontrolado" },
  { way: "REASON", level: "high", word: "cauteloso" },
  { way: "REASON", level: "high", word: "perspicaz" },
  { way: "REASON", level: "high", word: "focado" },
  { way: "REASON", level: "high", word: "lógico" },
  { way: "REASON", level: "high", word: "ponderado" },
  { way: "REASON", level: "low", word: "audacioso" },
  { way: "REASON", level: "low", word: "espontâneo" },
  { way: "CONVICTION", level: "high", word: "generoso" },
  { way: "CONVICTION", level: "high", word: "incorruptível" },
  { way: "CONVICTION", level: "high", word: "leal" },
  { way: "CONVICTION", level: "high", word: "perseverante" },
  { way: "CONVICTION", level: "high", word: "íntegro" },
  { way: "CONVICTION", level: "low", word: "livre-pensador" },
  { way: "CONVICTION", level: "low", word: "independente" },
];

export const FLAWS: TraitOption[] = [
  { way: "COMBATIVENESS", level: "high", word: "impulsivo" },
  { way: "COMBATIVENESS", level: "high", word: "presunçoso" },
  { way: "COMBATIVENESS", level: "high", word: "orgulhoso" },
  { way: "COMBATIVENESS", level: "high", word: "obstinado" },
  { way: "COMBATIVENESS", level: "high", word: "vaidoso" },
  { way: "COMBATIVENESS", level: "low", word: "covarde" },
  { way: "COMBATIVENESS", level: "low", word: "medroso" },
  { way: "COMBATIVENESS", level: "low", word: "pessimista" },
  { way: "COMBATIVENESS", level: "low", word: "apático" },
  { way: "CREATIVITY", level: "high", word: "excêntrico" },
  { way: "CREATIVITY", level: "high", word: "mentiroso" },
  { way: "CREATIVITY", level: "high", word: "inconformado" },
  { way: "CREATIVITY", level: "high", word: "rebelde" },
  { way: "CREATIVITY", level: "high", word: "indisciplinado" },
  { way: "CREATIVITY", level: "low", word: "sem graça" },
  { way: "CREATIVITY", level: "low", word: "deselegante" },
  { way: "CREATIVITY", level: "low", word: "de mente fechada" },
  { way: "CREATIVITY", level: "low", word: "rígido" },
  { way: "AWARENESS", level: "high", word: "carente" },
  { way: "AWARENESS", level: "high", word: "emotivo" },
  { way: "AWARENESS", level: "high", word: "fofoqueiro" },
  { way: "AWARENESS", level: "high", word: "sugestionável" },
  { way: "AWARENESS", level: "low", word: "frio" },
  { way: "AWARENESS", level: "low", word: "individualista" },
  { way: "AWARENESS", level: "low", word: "insensível" },
  { way: "AWARENESS", level: "low", word: "taciturno" },
  { way: "REASON", level: "high", word: "hesitante" },
  { way: "REASON", level: "high", word: "excessivamente cauteloso" },
  { way: "REASON", level: "high", word: "absorto em si mesmo" },
  { way: "REASON", level: "low", word: "distraído" },
  { way: "REASON", level: "low", word: "inconsequente" },
  { way: "REASON", level: "low", word: "impensado" },
  { way: "CONVICTION", level: "high", word: "influenciável" },
  { way: "CONVICTION", level: "high", word: "fanático" },
  { way: "CONVICTION", level: "high", word: "intolerante" },
  { way: "CONVICTION", level: "high", word: "rígido" },
  { way: "CONVICTION", level: "low", word: "caprichoso" },
  { way: "CONVICTION", level: "low", word: "dúbio" },
  { way: "CONVICTION", level: "low", word: "inconstante" },
  { way: "CONVICTION", level: "low", word: "pouco confiável" },
];
