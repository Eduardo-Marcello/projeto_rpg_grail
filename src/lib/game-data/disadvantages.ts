// Etapa 6: Disadvantages (Desvantagens) — corebook p.183-188.
// Fonte: reference/corebook_fulltext.txt, páginas 183-188.
// Um personagem pode ter até 5 Desvantagens; cada uma concede pontos de
// Experiência (exceto as de idade, que não concedem XP — ver Etapa 5).
// "maxTimes" > 1 indica desvantagens que podem ser tomadas mais de uma vez
// (custo adicional, geralmente diferente, indicado em "repeatCost"/"repeatName").

export type DisadvantageKey =
  | "GULLIBLE"
  | "HONORLESS"
  | "INSUBORDINATE"
  | "MABDS_ILL_OMEN"
  | "OATHBOUND"
  | "RUMOR"
  | "UNBELIEVER"
  | "UNWELL"
  | "WYRDNESS_TAINTED"
  | "ANIMAL_HOSTILITY"
  | "ARCANE_FRAILTY"
  | "ARTHRITIS"
  | "CLUMSY"
  | "CRAVEN"
  | "FORSAKEN"
  | "GODFORSAKEN"
  | "LONE_WOLF"
  | "OATHBREAKER"
  | "OLD_WOUND"
  | "POOR"
  | "RATTLED"
  | "WEAKENED"
  | "ADVERSARY"
  | "SLOW_RECOVERY"
  | "WYRDNESS_PHOBIA"
  | "CROM_CRUACHS_GLARE"
  | "WRETCHED_FORTUNE"
  | "HUNTED"
  | "RED_DEATH";

export interface DisadvantageDef {
  key: DisadvantageKey;
  name: string;
  cost: number;
  summary: string;
  maxTimes: 1 | 2;
  repeatCost?: number;
  repeatName?: string;
  // true = desvantagem única na mesa (só um personagem pode ter).
  uniqueAtTable?: boolean;
}

export const DISADVANTAGES: DisadvantageDef[] = [
  {
    key: "GULLIBLE",
    name: "Crédulo",
    cost: 10,
    maxTimes: 1,
    summary:
      "−1 em rolagens contestadas; preços de bens e serviços são 1 Riqueza mais altos para o personagem.",
  },
  {
    key: "HONORLESS",
    name: "Sem Honra",
    cost: 10,
    maxTimes: 1,
    summary: "−1 em rolagens para inspirar outros (Compaixão, Inspiração ou Liderança).",
  },
  {
    key: "INSUBORDINATE",
    name: "Insubordinado",
    cost: 10,
    maxTimes: 1,
    summary: "Qualquer bônus que ganhe de rolagens de Liderança é reduzido em 1.",
  },
  {
    key: "MABDS_ILL_OMEN",
    name: "Mau-Presságio de Mabd",
    cost: 10,
    maxTimes: 1,
    summary: "Uma vez por sessão, o mestre pode obrigar o jogador a rerrolar (o segundo resultado vale).",
  },
  {
    key: "OATHBOUND",
    name: "Sob Juramento",
    cost: 10,
    maxTimes: 1,
    summary:
      "Um juramento com tabus intransponíveis: −1 em todas as rolagens na presença do tabu, e não pode gastar Pontos de Sobrevivência nesse momento. Quebrar o tabu torna a penalidade permanente até expiação.",
  },
  {
    key: "RUMOR",
    name: "Rumor",
    cost: 10,
    maxTimes: 1,
    summary: "−1 em rolagens de Comunicação com quem conhece o rumor malicioso sobre o personagem.",
  },
  {
    key: "UNBELIEVER",
    name: "Descrente",
    cost: 10,
    maxTimes: 1,
    summary: "Qualquer bônus que ganhe de rolagens de Religião é reduzido em 1.",
  },
  {
    key: "UNWELL",
    name: "Adoentado",
    cost: 10,
    maxTimes: 2,
    repeatCost: 5,
    repeatName: "Doentio (dobra a penalidade)",
    summary: "−1 em rolagens de Vigor contra doenças e venenos.",
  },
  {
    key: "WYRDNESS_TAINTED",
    name: "Marcado pela Wyrdness",
    cost: 10,
    maxTimes: 1,
    summary: "−2 em rolagens sociais devido à exposição prolongada à Wyrdness.",
  },
  {
    key: "ANIMAL_HOSTILITY",
    name: "Hostilidade Animal",
    cost: 20,
    maxTimes: 1,
    summary: "Todos os animais são hostis ao personagem; −2 para interagir com animais domésticos (montar, lutar montado, etc.).",
  },
  {
    key: "ARCANE_FRAILTY",
    name: "Fragilidade Arcana",
    cost: 20,
    maxTimes: 1,
    summary: "−2 em rolagens de Vigor e Resistência Mental para resistir a efeitos de feitiços.",
  },
  {
    key: "ARTHRITIS",
    name: "Artrite",
    cost: 20,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Esclerodermia (mais −1 de Velocidade)",
    summary: "Velocidade reduzida em 1.",
  },
  {
    key: "CLUMSY",
    name: "Desajeitado",
    cost: 20,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Presa Fácil (mais −1 de Defesa)",
    summary: "Defesa reduzida em 1.",
  },
  {
    key: "CRAVEN",
    name: "Covarde",
    cost: 20,
    maxTimes: 1,
    summary: "−3 em rolagens de Resistência Mental contra Pressão de Combate.",
  },
  {
    key: "FORSAKEN",
    name: "Renegado",
    cost: 20,
    maxTimes: 1,
    summary: "Um grupo, vila ou parte da ilha o rejeita e agirá com hostilidade contra o personagem.",
  },
  {
    key: "GODFORSAKEN",
    name: "Abandonado pelos Deuses",
    cost: 20,
    maxTimes: 1,
    summary: "O total de Pontos de Sobrevivência do personagem é reduzido em 1.",
  },
  {
    key: "LONE_WOLF",
    name: "Lobo Solitário",
    cost: 20,
    maxTimes: 1,
    summary: "Não pode ganhar nem conceder bônus de Trabalho em Equipe.",
  },
  {
    key: "OATHBREAKER",
    name: "Quebrador de Juramento",
    cost: 20,
    maxTimes: 1,
    summary:
      "No início de cada sessão, rola 1D10; se o resultado for ≤ Convicção, não pode usar Pontos de Sobrevivência naquela sessão.",
  },
  {
    key: "OLD_WOUND",
    name: "Ferida Antiga",
    cost: 20,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Mutilado (perde também uma caixa de \"Razoável\")",
    summary: "Perde uma caixa da categoria \"Bem\" da tabela de Condição de Saúde.",
  },
  {
    key: "POOR",
    name: "Pobre",
    cost: 20,
    maxTimes: 1,
    summary: "Começa a aventura sem Riquezas e sem posses além do kit de Equipamento de Viagem.",
  },
  {
    key: "RATTLED",
    name: "Perturbado",
    cost: 20,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Traumatizado (mais −1 de Resistência Mental)",
    summary: "Resistência Mental reduzida em 1, devido a um evento traumático.",
  },
  {
    key: "WEAKENED",
    name: "Debilitado",
    cost: 20,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Extenuado (mais −1 de Vigor)",
    summary: "Vigor reduzido em 1, sequela de uma doença grave superada.",
  },
  {
    key: "ADVERSARY",
    name: "Adversário",
    cost: 30,
    maxTimes: 1,
    summary: "Alguém de poder moderado guarda rancor profundo e tentará enganar, humilhar ou derrotar o personagem publicamente.",
  },
  {
    key: "SLOW_RECOVERY",
    name: "Recuperação Lenta",
    cost: 30,
    maxTimes: 1,
    summary: "Pontos de Vida recuperados por descanso, remédios, Cura ou feitiços são reduzidos à metade (arredondado para cima).",
  },
  {
    key: "WYRDNESS_PHOBIA",
    name: "Fobia da Wyrdness",
    cost: 30,
    maxTimes: 1,
    summary: "−2 em rolagens de perícia e Resistência Mental na Wyrdness desprotegido (−1 se protegido por um repelente).",
  },
  {
    key: "CROM_CRUACHS_GLARE",
    name: "Olhar de Crom Cruach",
    cost: 40,
    maxTimes: 1,
    uniqueAtTable: true,
    summary: "Ao determinar oposição pelo nível de Wyrdness do Território, este é considerado um nível acima.",
  },
  {
    key: "WRETCHED_FORTUNE",
    name: "Fortuna Funesta",
    cost: 40,
    maxTimes: 1,
    summary: "Ao rolar 1, a falha crítica é confirmada com um resultado de 1, 2 ou 3 na segunda rolagem.",
  },
  {
    key: "HUNTED",
    name: "Caçado",
    cost: 50,
    maxTimes: 1,
    summary: "Um inimigo poderoso busca eliminar o personagem; só a morte de um dos dois encerra a caçada.",
  },
  {
    key: "RED_DEATH",
    name: "Morte Vermelha",
    cost: 50,
    maxTimes: 1,
    summary: "O personagem contraiu a Morte Vermelha e morrerá em 1D10+4 meses, salvo uma cura milagrosa.",
  },
];

export function getDisadvantage(key: DisadvantageKey): DisadvantageDef {
  const d = DISADVANTAGES.find((x) => x.key === key);
  if (!d) throw new Error(`Desvantagem desconhecida: ${key}`);
  return d;
}
