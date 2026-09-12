// Etapa 4: Occupation and Skills (Ocupação e Perícias) — corebook p.174-178.
// Fonte: reference/corebook_fulltext.txt, páginas 174-178.
// Cada Ocupação concede: 5 pontos no Domínio Primário, 3 pontos em UM dos
// Domínios Secundários (escolha do jogador) e 1 ponto em UM dos Domínios
// Terciários (escolha do jogador).

import type { DomainKey } from "./domains";

export type OccupationKey =
  | "ADVISOR"
  | "AUGUR"
  | "BARD"
  | "COURIER"
  | "CRAFTSMAN"
  | "EXECUTIONER"
  | "HEALER"
  | "HORSE_BREEDER"
  | "HUNTER"
  | "INITIATE"
  | "KNIGHT"
  | "LABORER"
  | "MAGICIAN"
  | "MISTFARER"
  | "RULER"
  | "SCHOLAR"
  | "SCOUT"
  | "SOLDIER"
  | "THUG"
  | "TRADER";

export interface OccupationDef {
  key: OccupationKey;
  name: string;
  summary: string;
  primary: DomainKey;
  secondaryOptions: DomainKey[];
  tertiaryOptions: DomainKey[];
}

export const OCCUPATIONS: OccupationDef[] = [
  {
    key: "ADVISOR",
    name: "Conselheiro",
    summary:
      "Sussurra nos ouvidos de novos líderes e articula nas sombras — um político consumado, ao mesmo tempo maquinador e marionetista.",
    primary: "COMMUNICATION",
    secondaryOptions: ["LEADERSHIP", "RELIGION"],
    tertiaryOptions: ["ERUDITION", "INSPIRATION", "WYRDNESS_MYSTERIES"],
  },
  {
    key: "AUGUR",
    name: "Áugure",
    summary:
      "Guia pessoas em busca de respostas ou de um sinal dos deuses, interpretando presságios e realizando ritos antigos.",
    primary: "WYRDNESS_MYSTERIES",
    secondaryOptions: ["MAGIC", "RELIGION"],
    tertiaryOptions: ["INSPIRATION", "MONSTERS", "NATURAL_ENVIRONMENT"],
  },
  {
    key: "BARD",
    name: "Bardo",
    summary:
      "Guardião da memória oral de Avalon, percorre a ilha com seu instrumento trazendo à vida os heróis do passado.",
    primary: "PERFORMANCE",
    secondaryOptions: ["INSPIRATION", "COMMUNICATION"],
    tertiaryOptions: ["COMPASSION", "SHOOT_THROW", "TRAVEL"],
  },
  {
    key: "COURIER",
    name: "Correio",
    summary:
      "Cavaleiro destemido que mergulha na névoa para manter viva a diplomacia, bem equipado por seus empregadores.",
    primary: "STEALTH",
    secondaryOptions: ["RELIGION", "TRAVEL"],
    tertiaryOptions: ["MAGIC", "MOUNTED_COMBAT", "SHOOT_THROW"],
  },
  {
    key: "CRAFTSMAN",
    name: "Artesão",
    summary:
      "Trabalhador manual habilidoso dedicado à produção e manutenção de bens — ferreiros, moleiros, tecelões e carpinteiros.",
    primary: "CRAFT",
    secondaryOptions: ["ERUDITION", "HEALING"],
    tertiaryOptions: ["INSPIRATION", "PERCEPTION", "COMMUNICATION"],
  },
  {
    key: "EXECUTIONER",
    name: "Executor",
    summary:
      "Cumpre sentenças conforme exigências rituais e religiosas; função hereditária, vivendo à margem das vilas como um pária.",
    primary: "FEATS",
    secondaryOptions: ["CLOSE_COMBAT", "PERFORMANCE"],
    tertiaryOptions: ["LEADERSHIP", "RELIGION", "STEALTH"],
  },
  {
    key: "HEALER",
    name: "Curandeiro",
    summary:
      "Usa suas habilidades e seu arsenal de remédios para combater doenças e preservar a vida, tão preciosa nestas terras.",
    primary: "HEALING",
    secondaryOptions: ["COMPASSION", "CRAFT"],
    tertiaryOptions: ["MAGIC", "NATURAL_ENVIRONMENT", "WYRDNESS_MYSTERIES"],
  },
  {
    key: "HORSE_BREEDER",
    name: "Criador de Cavalos",
    summary:
      "Cria, treina e cuida de montarias raras e valiosas, essenciais para atravessar a névoa com rapidez.",
    primary: "MOUNTED_COMBAT",
    secondaryOptions: ["FEATS", "MONSTERS"],
    tertiaryOptions: ["PERCEPTION", "PERFORMANCE", "TRAVEL"],
  },
  {
    key: "HUNTER",
    name: "Caçador",
    summary:
      "Adentra terras inóspitas habitadas por bestas selvagens, sozinho ou com seu cão, em busca de presas.",
    primary: "MONSTERS",
    secondaryOptions: ["NATURAL_ENVIRONMENT", "SHOOT_THROW"],
    tertiaryOptions: ["HEALING", "MOUNTED_COMBAT", "STEALTH"],
  },
  {
    key: "INITIATE",
    name: "Iniciado",
    summary:
      "Termo genérico para seguidores e oficiantes de uma das muitas religiões praticadas em Avalon.",
    primary: "RELIGION",
    secondaryOptions: ["HEALING", "PERFORMANCE"],
    tertiaryOptions: ["ERUDITION", "FEATS", "COMMUNICATION"],
  },
  {
    key: "KNIGHT",
    name: "Cavaleiro",
    summary:
      "Membro de uma ordem cavalheiresca recém-formada, em busca de bravura e reconhecimento à altura da Távola Redonda.",
    primary: "INSPIRATION",
    secondaryOptions: ["CLOSE_COMBAT", "MOUNTED_COMBAT"],
    tertiaryOptions: ["LEADERSHIP", "MAGIC", "RELIGION"],
  },
  {
    key: "LABORER",
    name: "Trabalhador",
    summary:
      "Sempre há trabalho a fazer — braços fortes e versáteis, viajantes que se dedicam à recuperação da civilização.",
    primary: "NATURAL_ENVIRONMENT",
    secondaryOptions: ["FEATS", "TRAVEL"],
    tertiaryOptions: ["CRAFT", "HEALING", "STEALTH"],
  },
  {
    key: "MAGICIAN",
    name: "Mago",
    summary:
      "Poucos avalonianos têm a ambição de buscar os arcanos perigosos — arcanistas, druidas, feras e feiticeiros em formação.",
    primary: "MAGIC",
    secondaryOptions: ["ERUDITION", "WYRDNESS_MYSTERIES"],
    tertiaryOptions: ["CRAFT", "HEALING", "MONSTERS"],
  },
  {
    key: "MISTFARER",
    name: "Andarilho da Névoa",
    summary:
      "Exploradores experientes encarregados de expedições perigosas pela Wyrdness, guiando caravanas entre comunidades isoladas.",
    primary: "TRAVEL",
    secondaryOptions: ["STEALTH", "WYRDNESS_MYSTERIES"],
    tertiaryOptions: ["CLOSE_COMBAT", "NATURAL_ENVIRONMENT", "SHOOT_THROW"],
  },
  {
    key: "RULER",
    name: "Governante",
    summary:
      "Lidera e protege seus seguidores das muitas ameaças da ilha, negociando com emissários, senhores da guerra e a Coroa.",
    primary: "LEADERSHIP",
    secondaryOptions: ["COMPASSION", "INSPIRATION"],
    tertiaryOptions: ["MOUNTED_COMBAT", "PERFORMANCE", "RELIGION"],
  },
  {
    key: "SCHOLAR",
    name: "Erudito",
    summary:
      "Dedica sua existência a desvendar, pesquisar e transmitir o conhecimento indispensável para a elevação da humanidade.",
    primary: "ERUDITION",
    secondaryOptions: ["MAGIC", "MONSTERS"],
    tertiaryOptions: ["CRAFT", "LEADERSHIP", "PERCEPTION"],
  },
  {
    key: "SCOUT",
    name: "Batedor",
    summary:
      "Encarregado de reconhecimento e vigilância em território inimigo, explorando falhas e forjando caminhos seguros pela Wyrdness.",
    primary: "PERCEPTION",
    secondaryOptions: ["NATURAL_ENVIRONMENT", "SHOOT_THROW"],
    tertiaryOptions: ["CLOSE_COMBAT", "COMPASSION", "TRAVEL"],
  },
  {
    key: "SOLDIER",
    name: "Soldado",
    summary:
      "Luta por seu senhor, sua rainha ou por quem pagar mais, em troca de um salário modesto e a promessa de um pedaço de terra.",
    primary: "CLOSE_COMBAT",
    secondaryOptions: ["LEADERSHIP", "MOUNTED_COMBAT"],
    tertiaryOptions: ["FEATS", "MONSTERS", "WYRDNESS_MYSTERIES"],
  },
  {
    key: "THUG",
    name: "Rufião",
    summary:
      "Mercenários, executores, guarda-costas e cortadores de bolsa levam uma existência marginal marcada pela violência.",
    primary: "SHOOT_THROW",
    secondaryOptions: ["PERCEPTION", "STEALTH"],
    tertiaryOptions: ["CLOSE_COMBAT", "FEATS", "COMMUNICATION"],
  },
  {
    key: "TRADER",
    name: "Mercador",
    summary:
      "Organiza expedições e enfrenta o desconhecido em busca de lucro, plantando as semente das cidades de amanhã.",
    primary: "COMPASSION",
    secondaryOptions: ["CRAFT", "PERCEPTION"],
    tertiaryOptions: ["ERUDITION", "COMMUNICATION", "PERFORMANCE"],
  },
];

export function getOccupation(key: OccupationKey): OccupationDef {
  const occ = OCCUPATIONS.find((o) => o.key === key);
  if (!occ) throw new Error(`Ocupação desconhecida: ${key}`);
  return occ;
}
