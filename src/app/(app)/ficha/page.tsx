import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/db";

export default async function FichaPage() {
  const user = await requireUser();
  const characters = await prisma.characterSheet.findMany({
    where: { userId: user.userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Suas fichas</h1>
        <p className="mt-1 text-sm text-foreground/70">
          O assistente de criação de personagem (10 etapas do corebook) chega
          na Fase 1. Por agora, esta aba só confirma que a sessão e o banco
          estão funcionando.
        </p>
      </div>

      {characters.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Nenhuma ficha ainda. {user.username}, você ainda não tem personagens
          salvos.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {characters.map((c) => (
            <li
              key={c.id}
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm"
            >
              {c.name ?? "(sem nome ainda)"} — {c.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
