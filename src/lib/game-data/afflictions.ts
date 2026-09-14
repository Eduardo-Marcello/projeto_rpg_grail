// Torments e Routs — corebook p.288-289 (tabelas de 1D10).
// Fonte: reference/corebook_fulltext.txt, páginas 288-289.
// Um personagem só pode sofrer 1 Torment e 1 Rout por vez (p.287).

export interface AfflictionDef {
  roll: number;
  name: string;
  summary: string;
}

export const TORMENTS: AfflictionDef[] = [
  { roll: 1, name: "Angústia", summary: "-1 em todas as ações; nova rolagem de Resistência Mental após 1 semana (penalidade cumulativa até -5 se falhar)." },
  { roll: 2, name: "Pesadelo", summary: "-1 em todas as ações por pesadelos recorrentes; nova rolagem após 1 semana (penalidade cumulativa até -5)." },
  { roll: 3, name: "Choro", summary: "Desorientado por 1D10 minutos, não pode agir (mas se defende se atacado)." },
  { roll: 4, name: "Fuga", summary: "Foge correndo na direção oposta por 1D10 minutos, largando o que segurava." },
  { roll: 5, name: "Náusea", summary: "-1 em todas as ações por 1D10 horas." },
  { roll: 6, name: "Obsessão", summary: "Fascínio mórbido pelo gatilho do trauma; nova rolagem após 1 semana." },
  { roll: 7, name: "Fobia", summary: "-2 em rolagens perto da fonte do medo; nova rolagem após 1 mês." },
  { roll: 8, name: "Esconderijo", summary: "Foge em busca de um esconderijo, abandona companheiros por 1D10 minutos." },
  { roll: 9, name: "Estupor", summary: "Paralisado e incapaz de se defender por 1D10 minutos (só um golpe, água fria ou teste de Inspiração o tira disso)." },
  { roll: 10, name: "Mente Calma", summary: "Supera o choque: +1 em todas as ações pela próxima hora." },
];

export const ROUTS: AfflictionDef[] = [
  { roll: 1, name: "Enfurecido", summary: "Deve atacar o alvo mais próximo a cada Round, amigo ou inimigo." },
  { roll: 2, name: "Distraído", summary: "-2 em Magia; perde bônus de Liderança de terceiros." },
  { roll: 3, name: "Desarmado", summary: "Derruba a arma; precisa de uma ação para pegá-la de volta, não pode aparar." },
  { roll: 4, name: "Precipitação", summary: "Perde os bônus da Postura (mantém penalidades); aliados a 3,5m sofrem -1." },
  { roll: 5, name: "Fuga", summary: "Precisa de um teste de Proezas para sair de cena; falha = desmaia pelo resto da batalha." },
  { roll: 6, name: "Fúria", summary: "+2 em rolagens de combate, mas -4 de Defesa." },
  { roll: 7, name: "Erro Grosseiro", summary: "-2 em Combate Corpo a Corpo, Tiro e Lançamento, Proezas e Magia." },
  { roll: 8, name: "Paralisado", summary: "Não pode se mover até um novo teste de Resistência Mental; -2 de Defesa enquanto durar." },
  { roll: 9, name: "Escondido", summary: "Busca abrigo no próximo Round; depois se agacha e espera o fim da luta." },
  { roll: 10, name: "Novo Fôlego", summary: "+1 em rolagens de combate pelos próximos 3 Rounds." },
];
