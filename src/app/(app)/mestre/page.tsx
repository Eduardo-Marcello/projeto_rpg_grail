import Link from "next/link";
import { requireGM } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { promoteToGMAction } from "@/lib/actions/users";
import { createMonsterAction } from "@/lib/actions/monsters";
import { DeleteMonsterButton } from "@/components/monster/DeleteMonsterButton";

export default async function MestrePage() {
  // Checagem própria da rota, além do menu já esconder o link para
  // PLAYER — ver node_modules/next/dist/docs/.../authentication.md
  // ("Layouts and auth checks": a checagem tem que ficar perto dos
  // dados, não só no layout/menu).
  await requireGM();

  // Monstros/NPCs são compartilhados entre todos os Mestres da mesa
  // (decisão do usuário) — sem filtro por gmId.
  const [monsters, players] = await Promise.all([
    prisma.monsterOrNpc.findMany({
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Aba do Mestre</h1>
            <p className="mt-1 text-sm text-foreground/70">
              Cadastro de monstros e NPCs (p.367-369) — compartilhado entre todos os Mestres
              da mesa.
            </p>
          </div>
          <form action={createMonsterAction}>
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
            >
              Criar novo
            </button>
          </form>
        </div>

        {monsters.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">
            Nenhum monstro/NPC cadastrado ainda.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {monsters.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm hover:border-accent"
              >
                <Link href={`/mestre/${m.id}`} className="flex flex-1 items-center justify-between gap-4">
                  <span>{m.name}</span>
                  <span className="text-foreground/60">
                    {m.wyrdnessLevel != null ? `Nível de Wyrdness ${m.wyrdnessLevel}` : ""}
                  </span>
                </Link>
                <DeleteMonsterButton
                  monsterId={m.id}
                  monsterName={m.name}
                  className="shrink-0 text-xs text-foreground/40 hover:text-red-600"
                />
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
