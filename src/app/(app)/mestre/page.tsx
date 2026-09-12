import { requireGM } from "@/lib/dal";
import { prisma } from "@/lib/db";

export default async function MestrePage() {
  // Checagem própria da rota, além do menu já esconder o link para
  // PLAYER — ver node_modules/next/dist/docs/.../authentication.md
  // ("Layouts and auth checks": a checagem tem que ficar perto dos
  // dados, não só no layout/menu).
  const gm = await requireGM();

  const monsters = await prisma.monsterOrNpc.findMany({
    where: { gmId: gm.userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Aba do Mestre</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Cadastro de monstros e NPCs (Fase 5) — visível e editável só por
          quem tem o papel de Mestre.
        </p>
      </div>

      {monsters.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Nenhum monstro/NPC cadastrado ainda.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {monsters.map((m) => (
            <li
              key={m.id}
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm"
            >
              {m.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
