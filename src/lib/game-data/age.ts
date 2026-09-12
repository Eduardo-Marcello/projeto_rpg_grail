// Etapa 5: Age (Idade) — corebook p.181.
// Fonte: reference/corebook_fulltext.txt, página 181.
// Idade mínima: 15 anos. Quanto mais velho, mais bônus em Domínios, mas
// mais Desvantagens (que, nesse caso, NÃO concedem pontos de Experiência).

export interface AgeBandDef {
  minAge: number;
  maxAge: number | null;
  label: string;
  domainBonusCount: number; // quantos Domínios distintos recebem +1
  disadvantagePoints: number; // pontos de Desvantagem obrigatórios (sem XP)
}

export const AGE_BANDS: AgeBandDef[] = [
  { minAge: 15, maxAge: 20, label: "15-20", domainBonusCount: 0, disadvantagePoints: 0 },
  { minAge: 21, maxAge: 30, label: "21-30", domainBonusCount: 1, disadvantagePoints: 10 },
  { minAge: 31, maxAge: 40, label: "31-40", domainBonusCount: 2, disadvantagePoints: 20 },
  { minAge: 41, maxAge: null, label: "41+", domainBonusCount: 3, disadvantagePoints: 30 },
];

export function getAgeBand(age: number): AgeBandDef {
  const band = AGE_BANDS.find(
    (b) => age >= b.minAge && (b.maxAge === null || age <= b.maxAge),
  );
  if (!band) throw new Error(`Idade inválida: ${age} (mínimo 15)`);
  return band;
}
