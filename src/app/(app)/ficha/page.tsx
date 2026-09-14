import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { createCharacterAction } from "@/lib/actions/character";
import { DeleteCharacterButton } from "@/components/sheet/DeleteCharacterButton";

export default async function FichaPage() {
  const user = await requireUser();
  const characters = await prisma.characterSheet.findMany({
    where: { userId: user.userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Suas fichas</h1>
          <p className="mt-1 text-sm text-foreground/70">
            Crie uma ficha seguindo as 10 etapas do corebook, ou continue uma
            em andamento.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Link
            href="/ficha/importar"
            className="rounded-md border border-accent px-4 py-2 text-sm font-medium text-accent"
          >
            Importar .json
          </Link>
          <form action={createCharacterAction}>
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground"
            >
              Criar nova ficha
            </button>
          </form>
        </div>
      </div>

      {characters.length === 0 ? (
        <p className="text-sm text-foreground/60">
          Nenhuma ficha ainda. {user.username}, comece clicando em &ldquo;Criar
          nova ficha&rdquo;.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {characters.map((c) => {
            const href =
              c.status === "COMPLETE"
                ? `/ficha/${c.id}`
                : `/ficha/${c.id}/etapa/${c.creationStep + 1}`;
            return (
              <li
                key={c.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm hover:border-accent"
              >
                <Link href={href} className="flex flex-1 items-center justify-between gap-4">
                  <span>{c.name ?? "(sem nome ainda)"}</span>
                  <span className="text-foreground/60">
                    {c.status === "COMPLETE" ? "Completa" : `Rascunho — etapa ${c.creationStep}/10`}
                  </span>
                </Link>
                <DeleteCharacterButton
                  characterId={c.id}
                  characterName={c.name ?? ""}
                  className="shrink-0 text-xs text-foreground/40 hover:text-red-600"
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
