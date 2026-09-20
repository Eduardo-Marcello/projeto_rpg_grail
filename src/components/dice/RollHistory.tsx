function isCritical(breakdown: string) {
  if (breakdown.includes("crítico")) {
    return breakdown.includes("falha crítica") ? "fail" : "success";
  }
  return null;
}

export function RollHistory({
  rolls,
}: {
  rolls: { id: string; command: string; breakdown: string; result: number; createdAt: Date }[];
}) {
  if (rolls.length === 0) {
    return <p className="text-sm text-foreground/60">Nenhuma rolagem ainda.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {rolls.map((roll) => {
        const crit = isCritical(roll.breakdown);
        return (
          <li
            key={roll.id}
            className={
              "rounded-md border px-3 py-2 text-sm " +
              (crit === "success"
                ? "border-accent bg-accent/10"
                : crit === "fail"
                  ? "border-red-600/50 bg-red-600/10"
                  : "border-border bg-surface")
            }
          >
            <p className="font-medium">{roll.command}</p>
            <p className="mt-0.5 text-foreground/70">{roll.breakdown}</p>
            <p className="mt-1 text-xs text-foreground/40">
              {roll.createdAt.toLocaleString("pt-BR")}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
