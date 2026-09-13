import Link from "next/link";
import { requireOwnedCharacter } from "@/lib/dal";

const STEP_LABELS = [
  "Cor",
  "Origem",
  "Vias",
  "Ocupação",
  "Idade",
  "Experiência",
  "Equipamento",
  "Descrição",
  "Atributos",
  "Arco",
  "Final",
];

export default async function EtapaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex list-none flex-wrap p-0 text-xs">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1; // 11 = "final"
          const reachable = stepNum <= character.creationStep + 1;
          const href =
            stepNum === 11
              ? `/ficha/${character.id}/etapa/final`
              : `/ficha/${character.id}/etapa/${stepNum}`;
          // Borda em todos os estados (mesma espessura) para o tamanho do
          // botão nunca mudar entre estados — evita reflow/sobreposição
          // visual quando o passo atual muda. Margem (não gap) para o
          // espaçamento nunca depender de flex-gap.
          const content = (
            <span
              className={
                "block whitespace-nowrap rounded border px-2 py-1 " +
                (stepNum <= character.creationStep
                  ? "border-accent bg-accent text-accent-foreground"
                  : reachable
                    ? "border-accent text-accent"
                    : "border-border text-foreground/40")
              }
            >
              {i + 1}. {label}
            </span>
          );
          return (
            <li key={label} className="mr-1.5 mb-1.5">
              {reachable ? <Link href={href}>{content}</Link> : content}
            </li>
          );
        })}
      </ol>
      {children}
    </div>
  );
}
