import "server-only";
import { cache } from "react";
import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

// Data Access Layer — centraliza a verificação de sessão/autorização.
// Padrão recomendado em:
// node_modules/next/dist/docs/01-app/02-guides/authentication.md
// ("Creating a Data Access Layer (DAL)").
// Toda página, Server Action ou Route Handler que precise saber quem
// é o usuário logado deve chamar uma função daqui — nunca ler o
// cookie de sessão diretamente em outro lugar.

export interface CurrentUser {
  userId: string;
  username: string;
  role: "PLAYER" | "GM";
}

// Retorna o usuário logado, ou null se não houver sessão. Não redireciona.
export const getOptionalUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session.userId || !session.username || !session.role) return null;
  return {
    userId: session.userId,
    username: session.username,
    role: session.role,
  };
});

// Exige sessão válida; redireciona para /login se não houver.
export const requireUser = cache(async (): Promise<CurrentUser> => {
  const user = await getOptionalUser();
  if (!user) {
    redirect("/login");
  }
  return user;
});

// Exige sessão válida E papel de Mestre; redireciona jogadores para /ficha.
export const requireGM = cache(async (): Promise<CurrentUser> => {
  const user = await requireUser();
  if (user.role !== "GM") {
    redirect("/ficha");
  }
  return user;
});

// Carrega uma ficha garantindo que pertence ao usuário logado. 404 se não
// existir ou não for do usuário (não revelamos qual dos dois é o caso).
// cache(): o layout e a page da mesma etapa chamam isso com o mesmo id —
// dedup dentro do mesmo request.
export const requireOwnedCharacter = cache(async (characterId: string) => {
  const user = await requireUser();
  const character = await prisma.characterSheet.findUnique({
    where: { id: characterId },
  });
  if (!character || character.userId !== user.userId) {
    notFound();
  }
  return character;
});
