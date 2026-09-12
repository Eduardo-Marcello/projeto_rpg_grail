// Etapa 3: Ways (Vias) — corebook p.169-171.
// Fonte: reference/corebook_fulltext.txt, páginas 169-171.
// Textos em português são paráfrase própria, não tradução literal do livro.

export type WayKey =
  | "AWARENESS"
  | "COMBATIVENESS"
  | "CONVICTION"
  | "CREATIVITY"
  | "REASON";

export interface WayDef {
  key: WayKey;
  name: string;
  summary: string;
  // Falha associada à Via (p.170-171) — pode aparecer quando a Via tem
  // pontuação alta e a situação a coloca à prova.
  fault: { name: string; summary: string };
}

export const WAYS: WayDef[] = [
  {
    key: "AWARENESS",
    name: "Consciência",
    summary:
      "A ligação entre o personagem e o mundo à sua volta — inclusive o lado selvagem e imprevisível de Avalon.",
    fault: {
      name: "Influência",
      summary:
        "Quando a intensidade de um momento, visão ou encontro domina o personagem, ele pode tomar decisões estranhas ou incompreensíveis para os outros.",
    },
  },
  {
    key: "COMBATIVENESS",
    name: "Combatividade",
    summary:
      "O ímpeto e a pugnacidade do personagem — sua motivação, garra e dedicação.",
    fault: {
      name: "Paixão",
      summary:
        "Explosões de fúria, amor ou ódio incontroláveis, orgulho ferido, riscos desnecessários — o personagem reage por impulso quando algo o afeta profundamente.",
    },
  },
  {
    key: "CONVICTION",
    name: "Convicção",
    summary:
      "O fervor, o compromisso e os ideais de uma pessoa — religiosos, cavalheirescos ou um código pessoal de honra.",
    fault: {
      name: "Culpa",
      summary:
        "Ao trair, mentir ou agir contra seus próprios princípios, o personagem é tomado por remorso e vergonha.",
    },
  },
  {
    key: "CREATIVITY",
    name: "Criatividade",
    summary:
      "A capacidade de imaginar e encarar um problema (ou o mundo) de formas únicas — engenhosidade e improviso.",
    fault: {
      name: "Subversão",
      summary:
        "Não conformismo obstinado, excentricidade extrema, incapacidade de seguir regras — o personagem ignora consequências e age de forma errática.",
    },
  },
  {
    key: "REASON",
    name: "Razão",
    summary:
      "Racionalização e intelecto, mas também a maleabilidade da mente — curiosidade e inclinação para questões intelectuais.",
    fault: {
      name: "Dúvida",
      summary:
        "Diante de um grande dilema, o personagem é paralisado ou confuso, hesitante demais para agir.",
    },
  },
];

export function getWay(key: WayKey): WayDef {
  const way = WAYS.find((w) => w.key === key);
  if (!way) throw new Error(`Via desconhecida: ${key}`);
  return way;
}
