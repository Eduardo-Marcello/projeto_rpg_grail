export function Section({
  id,
  title,
  pages,
  children,
}: {
  id: string;
  title: string;
  pages: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-baseline justify-between gap-2 border-b border-border pb-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-xs text-foreground/50">corebook {pages}</span>
      </div>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-2 text-sm font-semibold text-accent">{children}</h3>;
}

export function Example({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border-l-4 border-accent bg-surface px-4 py-3 text-sm text-foreground/80">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">Exemplo</p>
      {children}
    </div>
  );
}

export function RuleTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max border-collapse text-left text-xs">
        <thead>
          <tr className="border-b border-border text-foreground/60">
            {headers.map((h) => (
              <th key={h} className="py-1.5 pr-4 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50">
              {row.map((cell, j) => (
                <td key={j} className="py-1.5 pr-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
