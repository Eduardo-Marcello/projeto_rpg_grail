// Etapa 1: Color (Cor) — corebook p.161-163.
// Fonte: reference/corebook_fulltext.txt, páginas 161-163.
// Textos em português são paráfrase própria (resumo), não tradução literal.

export type ColorKey = "BLUE" | "BROWN" | "GRAY" | "GREEN" | "RED";

export interface ColorDef {
  key: ColorKey;
  name: string;
  summary: string;
  stance: string;
  occupationExamples: string[];
  keywords: string[];
}

export const COLORS: ColorDef[] = [
  {
    key: "BLUE",
    name: "Azul",
    summary:
      "Voltada para o próximo: motivada por valores humanitários, coloca o bem comum acima dos impulsos pessoais e se dedica à proteção e à unificação da humanidade em Avalon.",
    stance:
      "\"Partilha e resiliência serão os alicerces do amanhã. Não é hora de discórdia.\"",
    occupationExamples: ["chefe de clã", "guarda", "curandeiro", "missionário"],
    keywords: ["destemido", "pilar da comunidade", "protetor", "resiliente", "forte"],
  },
  {
    key: "BROWN",
    name: "Marrom",
    summary:
      "Comprometida com a busca incansável por conhecimento, não aceita obstáculos em sua investigação e quer compartilhar o que descobre com uma humanidade deixada no escuro por tempo demais.",
    stance: "\"Só a elevação de mentes e espíritos pode garantir que a civilização perdure.\"",
    occupationExamples: ["alquimista", "astrólogo", "sábio", "erudito"],
    keywords: ["ponderado", "curioso", "perspicaz", "sagaz"],
  },
  {
    key: "GRAY",
    name: "Cinza",
    summary:
      "A campeã da excelência: busca constante aperfeiçoamento, guiada por um forte senso de nobreza e dever, rejeitando toda forma de degeneração.",
    stance: "\"Devemos nos erguer com firmeza ou perecer miseravelmente.\"",
    occupationExamples: ["aprendiz de cavaleiro", "mercenário", "estrategista", "tutor"],
    keywords: ["ambicioso", "líder", "nobre", "perfeccionista", "tático"],
  },
  {
    key: "GREEN",
    name: "Verde",
    summary:
      "Focada na natureza e na preservação do equilíbrio, convida seu portador a se libertar do jugo da civilização e buscar lugares desconhecidos do povo comum.",
    stance: "\"Ligando almas e comunidades, o ciclo pode ser preservado.\"",
    occupationExamples: ["druida", "geógrafo", "andarilho", "mercador viajante"],
    keywords: ["equilíbrio", "empatia", "energia", "jornada", "natureza"],
  },
  {
    key: "RED",
    name: "Vermelho",
    summary:
      "Uma força indefinível e em constante mutação, que adotou a mudança como seu principal motor e escapa a qualquer tentativa de controle ou categorização.",
    stance:
      "\"Só há um jeito de sobreviver em Avalon: evoluindo, adaptando-se e nunca descansando sobre os louros.\"",
    occupationExamples: ["barqueiro", "mensageiro", "contrabandista", "vigia"],
    keywords: ["anarquista", "audaz", "independente", "sobrevivente", "imprevisível"],
  },
];

export function getColor(key: ColorKey): ColorDef {
  const color = COLORS.find((c) => c.key === key);
  if (!color) throw new Error(`Cor desconhecida: ${key}`);
  return color;
}
