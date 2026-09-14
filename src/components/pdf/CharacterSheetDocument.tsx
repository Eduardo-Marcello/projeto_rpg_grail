import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { getColor, type ColorKey } from "@/lib/game-data/colors";
import { getOrigin, type OriginKey } from "@/lib/game-data/origins";
import { getOccupation, type OccupationKey } from "@/lib/game-data/occupations";
import { getDomain, type DomainKey } from "@/lib/game-data/domains";
import { WAYS } from "@/lib/game-data/ways";
import { getHealthStatus, HEALTH_TIERS } from "@/lib/health";
import { DISADVANTAGES } from "@/lib/game-data/disadvantages";
import { ADVANTAGES } from "@/lib/game-data/advantages";

// PDF da ficha — layout próprio (não é uma cópia visual da ficha oficial
// do livro, só organiza os mesmos dados; ver CLAUDE.md regra de direitos
// autorais). Serve para leitura/impressão; a atualização de uma ficha é
// feita reimportando o .json exportado (ver /ficha/[id]/json), não este
// PDF (ver Fase 2 do plano).

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#211b12" },
  title: { fontSize: 20, fontWeight: 700, marginBottom: 2 },
  subtitle: { fontSize: 11, color: "#5c5140", marginBottom: 12 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginTop: 14,
    marginBottom: 6,
    color: "#8a5a1e",
    borderBottom: "1pt solid #ddd3bc",
    paddingBottom: 2,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    border: "1pt solid #ddd3bc",
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  grid3: { flexDirection: "row", flexWrap: "wrap" },
  domainCell: { width: "33%", marginBottom: 8, paddingRight: 6 },
  domainName: { fontWeight: 700 },
  disciplineLine: { marginLeft: 8, color: "#5c5140" },
  paragraph: { marginBottom: 6, lineHeight: 1.4 },
  small: { fontSize: 8, color: "#8a7f68" },
});

export interface CharacterSheetPdfProps {
  name: string | null;
  color: string | null;
  origin: string | null;
  occupation: string | null;
  age: number | null;
  ways: { way: string; rating: number }[];
  domains: {
    domainKey: string;
    rating: number;
    bonus: number;
    penalty: number;
    disciplines: unknown;
  }[];
  potential: number;
  defense: number;
  speed: number;
  stamina: number;
  survivalPoints: number;
  survivalPointsCurrent: number | null;
  mentalResistance: number;
  healthBoxesChecked: number;
  torment: string | null;
  rout: string | null;
  magicPoints: number;
  magicPointsCurrent: number | null;
  riches: number;
  items: { type: string; name: string; stats: unknown }[];
  advantages: unknown;
  disadvantages: unknown;
  traits: unknown;
  personality: string | null;
  background: string | null;
  description: string | null;
  storyArc: unknown;
}

export function CharacterSheetDocument(props: CharacterSheetPdfProps) {
  const colorDef = props.color ? getColor(props.color as ColorKey) : null;
  const originDef = props.origin ? getOrigin(props.origin as OriginKey) : null;
  const occDef = props.occupation ? getOccupation(props.occupation as OccupationKey) : null;
  const health = getHealthStatus(props.healthBoxesChecked);
  const traits = (props.traits ?? null) as { quality?: { word: string }; flaw?: { word: string } } | null;
  const storyArc = (props.storyArc ?? null) as { quest?: string; acts?: string[] } | null;
  const advantages = ((props.advantages ?? []) as { key: string; times: number }[]);
  const disadvantages = ((props.disadvantages ?? []) as { key: string; times: number }[]);

  return (
    <Document title={`Ficha — ${props.name ?? "Personagem"}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{props.name ?? "(sem nome)"}</Text>
        <Text style={styles.subtitle}>
          {[colorDef?.name, originDef?.name, occDef?.name, props.age ? `${props.age} anos` : null]
            .filter(Boolean)
            .join(" · ")}
        </Text>
        {traits && (
          <Text style={styles.paragraph}>
            Qualidade: {traits.quality?.word ?? "—"} · Defeito: {traits.flaw?.word ?? "—"}
          </Text>
        )}

        <Text style={styles.sectionTitle}>Vias</Text>
        <View style={styles.row}>
          {WAYS.map((w) => (
            <Text key={w.key} style={styles.chip}>
              {w.name}: {props.ways.find((cw) => cw.way === w.key)?.rating ?? 0}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Atributos</Text>
        <View style={styles.row}>
          <Text style={styles.chip}>Potencial: {props.potential}</Text>
          <Text style={styles.chip}>Defesa: {props.defense}</Text>
          <Text style={styles.chip}>Velocidade: {props.speed}</Text>
          <Text style={styles.chip}>Vigor: {props.stamina}</Text>
          <Text style={styles.chip}>Resist. Mental: {props.mentalResistance}</Text>
          <Text style={styles.chip}>
            Sobrevivência: {props.survivalPointsCurrent ?? props.survivalPoints}/{props.survivalPoints}
          </Text>
          {props.magicPoints > 0 && (
            <Text style={styles.chip}>
              Magia: {props.magicPointsCurrent ?? props.magicPoints}/{props.magicPoints}
            </Text>
          )}
          <Text style={styles.chip}>Riquezas: {props.riches}</Text>
        </View>

        <Text style={styles.sectionTitle}>Condição de Saúde</Text>
        <View style={styles.row}>
          {HEALTH_TIERS.map((t) => (
            <Text key={t.key} style={styles.chip}>
              {t.name}: {t.boxes} caixa{t.boxes > 1 ? "s" : ""}
            </Text>
          ))}
        </View>
        <Text style={styles.paragraph}>
          Marcadas: {health.checked}/{health.total} — condição atual: {health.tier.name}
          {health.penalty !== 0 ? ` (${health.penalty})` : ""}
        </Text>
        {(props.torment || props.rout) && (
          <Text style={styles.paragraph}>
            {props.torment ? `Torment: ${props.torment}  ` : ""}
            {props.rout ? `Rout: ${props.rout}` : ""}
          </Text>
        )}

        <Text style={styles.sectionTitle}>Domínios e Disciplinas</Text>
        <View style={styles.grid3}>
          {props.domains
            .filter((d) => d.rating > 0)
            .map((d) => {
              const disciplines = (d.disciplines ?? []) as { name: string; rating: number }[];
              return (
                <View key={d.domainKey} style={styles.domainCell}>
                  <Text style={styles.domainName}>
                    {getDomain(d.domainKey as DomainKey).name}: {d.rating}
                    {d.bonus ? ` +${d.bonus}` : ""}
                    {d.penalty ? ` -${d.penalty}` : ""}
                  </Text>
                  {disciplines.map((disc, i) => (
                    <Text key={i} style={styles.disciplineLine}>
                      · {disc.name}: {disc.rating}
                    </Text>
                  ))}
                </View>
              );
            })}
        </View>

        <Text style={styles.sectionTitle}>Equipamento</Text>
        <View style={styles.row}>
          {props.items.map((item, i) => (
            <Text key={i} style={styles.chip}>
              {item.name}
            </Text>
          ))}
        </View>

        {(advantages.length > 0 || disadvantages.length > 0) && (
          <>
            <Text style={styles.sectionTitle}>Vantagens e Desvantagens</Text>
            <View style={styles.row}>
              {advantages.map((a, i) => {
                const def = ADVANTAGES.find((x) => x.key === a.key);
                return (
                  <Text key={i} style={styles.chip}>
                    {def?.name ?? a.key}
                    {a.times > 1 ? " (2x)" : ""}
                  </Text>
                );
              })}
              {disadvantages.map((d, i) => {
                const def = DISADVANTAGES.find((x) => x.key === d.key);
                return (
                  <Text key={i} style={styles.chip}>
                    {def?.name ?? d.key}
                    {d.times > 1 ? " (2x)" : ""}
                  </Text>
                );
              })}
            </View>
          </>
        )}

        {storyArc?.quest && (
          <>
            <Text style={styles.sectionTitle}>Arco Narrativo</Text>
            <Text style={styles.paragraph}>Quest: {storyArc.quest}</Text>
            {(storyArc.acts ?? []).map(
              (act, i) =>
                act && (
                  <Text key={i} style={styles.paragraph}>
                    Ato {i + 1}: {act}
                  </Text>
                ),
            )}
          </>
        )}

        {(props.personality || props.background || props.description) && (
          <>
            <Text style={styles.sectionTitle}>Descrição</Text>
            {props.personality && <Text style={styles.paragraph}>Personalidade: {props.personality}</Text>}
            {props.background && <Text style={styles.paragraph}>História: {props.background}</Text>}
            {props.description && <Text style={styles.paragraph}>Aparência: {props.description}</Text>}
          </>
        )}

        <Text style={styles.small}>
          Gerado por Tainted Grail — App de Fichas. Consulte o corebook oficial para as regras
          completas.
        </Text>
      </Page>
    </Document>
  );
}
