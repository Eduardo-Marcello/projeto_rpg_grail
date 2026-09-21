import { requireGM } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { promoteToGMAction } from "@/lib/actions/users";

export default async function MestrePage() {
  // Checagem própria da rota, além do menu já esconder o link para
  // PLAYER — ver node_modules/next/dist/docs/.../authentication.md
  // ("Layouts and auth checks": a checagem tem que ficar perto dos
  // dados, não só no layout/menu).
  const gm = await requireGM();

  const [monsters, players] = await Promise.all([
    prisma.monsterOrNpc.findMany({
      where: { gmId: gm.userId },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.findMany({
      where: { role: "PLAYER" },
      orderBy: { username: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Aba do Mestre</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Cadastro de monstros e NPCs (Fase 5) — visível e editável só por
          quem tem o papel de Mestre.
        </p>

        {monsters.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">
            Nenhum monstro/NPC cadastrado ainda.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
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

      <div>
        <h2 className="text-lg font-semibold">Promover Jogador a Mestre</h2>
        <p className="mt-1 text-sm text-foreground/70">
          A mesa pode ter mais de um Mestre. Quem já é Mestre pode promover
          outra pessoa aqui — não precisa ser sempre a primeira conta criada.
        </p>

        {players.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">
            Nenhum Jogador cadastrado ainda.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {players.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-4 py-3 text-sm"
              >
                <span>{p.username}</span>
                <form action={promoteToGMAction}>
                  <input type="hidden" name="userId" value={p.id} />
                  <button
                    type="submit"
                    className="rounded-md border border-accent px-3 py-1 text-sm font-medium text-accent"
                  >
                    Promover a Mestre
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
