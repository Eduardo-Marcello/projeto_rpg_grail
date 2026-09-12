// Etapa 6: Advantages (Vantagens) — corebook p.189-192.
// Fonte: reference/corebook_fulltext.txt, páginas 189-192.
// "creationOnly" = true marca vantagens com * no livro (só podem ser
// adquiridas na Criação de Personagem, não depois em jogo).

export type AdvantageKey =
  | "BONDED"
  | "CONTACT"
  | "DEEP_FAITH"
  | "HARDY"
  | "LUCHTAINES_TOUCH"
  | "SCHOLARLY"
  | "SIXTH_SENSE"
  | "UNPREDICTABLE"
  | "WEALTHY"
  | "ALLMOTHERS_FAVOR"
  | "DUAL_WIELDING"
  | "HERDED"
  | "HONORABLE"
  | "LEADER"
  | "LIGHTNING_STRIKE"
  | "LUCKY_STAR"
  | "MIRACLE_WORKER"
  | "MIST_EMBRACED"
  | "MISTWALKER"
  | "RADIANT"
  | "REPUTATION"
  | "STRONG_MIND"
  | "TOUGH"
  | "MENTOR"
  | "TALIESINS_GIFT"
  | "CHILD_OF_THE_WYRDNESS"
  | "LUGS_GRIP"
  | "ALLY"
  | "COMPANION";

export interface AdvantageDef {
  key: AdvantageKey;
  name: string;
  cost: number;
  summary: string;
  creationOnly?: boolean;
  maxTimes: 1 | 2;
  repeatCost?: number;
  repeatName?: string;
}

export const ADVANTAGES: AdvantageDef[] = [
  {
    key: "BONDED",
    name: "Vínculo",
    cost: 10,
    maxTimes: 1,
    summary: "Mantém 1D10 extra ao usar Trabalho em Equipe fora de combate com um companheiro que também tenha esta Vantagem.",
  },
  {
    key: "CONTACT",
    name: "Contato",
    cost: 10,
    maxTimes: 1,
    summary: "Um contato confiável (sem muito poder) que ajuda o personagem sem exigir nada em troca — mas o favor é mútuo.",
  },
  {
    key: "DEEP_FAITH",
    name: "Fé Profunda",
    cost: 10,
    maxTimes: 1,
    summary: "+2 em todas as rolagens de Religião e relacionadas.",
  },
  {
    key: "HARDY",
    name: "Robusto",
    cost: 10,
    creationOnly: true,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Incansável (dobra o bônus)",
    summary: "+1 em todas as rolagens de Vigor.",
  },
  {
    key: "LUCHTAINES_TOUCH",
    name: "Toque de Luchtaine",
    cost: 10,
    creationOnly: true,
    maxTimes: 1,
    summary: "+2 em rolagens de Ofício.",
  },
  {
    key: "SCHOLARLY",
    name: "Letrado",
    cost: 10,
    creationOnly: true,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Erudito (+1 em Erudição e Cura)",
    summary: "Lê e escreve com facilidade, independente do nível em Erudição.",
  },
  {
    key: "SIXTH_SENSE",
    name: "Sexto Sentido",
    cost: 10,
    creationOnly: true,
    maxTimes: 1,
    summary: "Não pode ser surpreendido — efeitos de Emboscada não se aplicam ao personagem.",
  },
  {
    key: "UNPREDICTABLE",
    name: "Imprevisível",
    cost: 10,
    maxTimes: 1,
    summary: "No início do Round, um oponente escolhido rola iniciativa duas vezes e mantém o menor; +1 em rolagens de combate contra ele até o fim da luta.",
  },
  {
    key: "WEALTHY",
    name: "Rico",
    cost: 10,
    creationOnly: true,
    maxTimes: 1,
    summary: "Possui uma reserva de valores guardada, no valor de 5 Riquezas.",
  },
  {
    key: "ALLMOTHERS_FAVOR",
    name: "Favor da Allmother",
    cost: 20,
    maxTimes: 1,
    summary: "O total de Pontos de Sobrevivência do personagem é aumentado em 1.",
  },
  {
    key: "DUAL_WIELDING",
    name: "Luta com Duas Armas",
    cost: 20,
    maxTimes: 1,
    summary: "+2 ao Potencial ao empunhar uma arma principal e uma secundária curta/leve (o maior dano entre as duas é usado).",
  },
  {
    key: "HERDED",
    name: "Favorecido pelo Stagfather",
    cost: 20,
    maxTimes: 1,
    summary: "+2 em Ambiente Natural, Percepção e Tiro e Lançamento em áreas silvestres/florestais (não se aplica em áreas urbanizadas ou nível 0 de Wyrdness).",
  },
  {
    key: "HONORABLE",
    name: "Honrado",
    cost: 20,
    creationOnly: true,
    maxTimes: 1,
    summary: "+3 em rolagens sociais, graças à reputação de integridade do personagem.",
  },
  {
    key: "LEADER",
    name: "Líder",
    cost: 20,
    creationOnly: true,
    maxTimes: 1,
    summary: "Qualquer bônus que conceda via rolagens de Liderança é aumentado em 1.",
  },
  {
    key: "LIGHTNING_STRIKE",
    name: "Golpe Fulminante",
    cost: 20,
    maxTimes: 1,
    summary: "No primeiro Round de combate, Velocidade +3 e +1 em rolagens de Combate Corpo a Corpo.",
  },
  {
    key: "LUCKY_STAR",
    name: "Estrela da Sorte",
    cost: 20,
    creationOnly: true,
    maxTimes: 1,
    summary: "No início de cada sessão, ganha um Ponto de Sobrevivência extra (usa ou dá a outro jogador; some se não for usado até o fim da sessão).",
  },
  {
    key: "MIRACLE_WORKER",
    name: "Milagreiro",
    cost: 20,
    creationOnly: true,
    maxTimes: 1,
    summary: "+2 em Cura e +1 em Compaixão; ao salvar alguém em Agonia, o Limiar de Dificuldade cai um nível (Complicado 14 em vez de Difícil 17).",
  },
  {
    key: "MIST_EMBRACED",
    name: "Abraçado pela Névoa",
    cost: 20,
    creationOnly: true,
    maxTimes: 1,
    summary: "+1 em rolagens de perícia, Resistência Mental e Vigor quando dentro ou perto (9m) da névoa (sem efeito em nível 0 de Wyrdness).",
  },
  {
    key: "MISTWALKER",
    name: "Caminhante da Névoa",
    cost: 20,
    maxTimes: 1,
    summary: "Em Território com Wyrdness nível 1 ou 2, pode rerrolar o dado dos efeitos da Wyrdness (o segundo resultado vale).",
  },
  {
    key: "RADIANT",
    name: "Radiante",
    cost: 20,
    creationOnly: true,
    maxTimes: 1,
    summary: "+1 em todas as rolagens durante o dia; −1 em todas as rolagens durante a noite.",
  },
  {
    key: "REPUTATION",
    name: "Reputação",
    cost: 20,
    creationOnly: true,
    maxTimes: 1,
    summary: "É famoso (com ou sem razão) — sem benefício mecânico direto, mas facilita conseguir audiências, abrigo ou pequenos favores.",
  },
  {
    key: "STRONG_MIND",
    name: "Mente Forte",
    cost: 20,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Fortaleza Mental (dobra o bônus)",
    summary: "Resistência Mental aumentada em 1.",
  },
  {
    key: "TOUGH",
    name: "Resistente",
    cost: 20,
    creationOnly: true,
    maxTimes: 2,
    repeatCost: 10,
    repeatName: "Duro como Aço (mais uma caixa de \"Razoável\")",
    summary: "Ganha uma caixa extra na categoria \"Bem\" da tabela de Condição de Saúde.",
  },
  {
    key: "MENTOR",
    name: "Mentor",
    cost: 30,
    maxTimes: 1,
    summary: "Um mentor guia o personagem; ganha 1 ponto em um Domínio à escolha (até o máximo de 5).",
  },
  {
    key: "TALIESINS_GIFT",
    name: "Dom de Taliesin",
    cost: 30,
    creationOnly: true,
    maxTimes: 1,
    summary: "+3 em rolagens de Performance; se desbloquear Pontos de Magia, o máximo aumenta em 2.",
  },
  {
    key: "CHILD_OF_THE_WYRDNESS",
    name: "Filho da Wyrdness",
    cost: 40,
    creationOnly: true,
    maxTimes: 1,
    summary: "+2 em Vigor e Resistência Mental relacionados à Wyrdness, e +2 para resistir a efeitos de feitiços.",
  },
  {
    key: "LUGS_GRIP",
    name: "Punho de Lug",
    cost: 40,
    creationOnly: true,
    maxTimes: 1,
    summary: "+1 em Combate Corpo a Corpo e Proezas; dano corpo a corpo, arremessado ou desarmado +1.",
  },
  {
    key: "ALLY",
    name: "Aliado",
    cost: 50,
    maxTimes: 1,
    summary: "Goza do favor de alguém poderoso e influente, que o ajudará sem esperar nada em troca (salvo grave ofensa).",
  },
  {
    key: "COMPANION",
    name: "Companheiro",
    cost: 50,
    maxTimes: 1,
    summary: "Um ajudante devoto (Montaria, Seguidor ou Familiar) — ver capítulo de Companheiros.",
  },
];

export function getAdvantage(key: AdvantageKey): AdvantageDef {
  const a = ADVANTAGES.find((x) => x.key === key);
  if (!a) throw new Error(`Vantagem desconhecida: ${key}`);
  return a;
}
