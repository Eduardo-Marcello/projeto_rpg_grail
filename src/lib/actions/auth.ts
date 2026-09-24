"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";
import { requireUser } from "@/lib/dal";
import {
  LoginFormSchema,
  RegisterFormSchema,
  type AuthFormState,
} from "@/lib/definitions/auth";

// Regra de bootstrap do papel de Mestre (decisão de implementação da Fase 0,
// não coberta em detalhe pelo plano — sinalizada ao usuário no resumo desta
// fase): a primeira conta criada no sistema recebe automaticamente o papel
// GM; todas as contas seguintes nascem como PLAYER. Promover/rebaixar um
// usuário depois é feito diretamente no banco por enquanto — não há UI para
// isso ainda.
export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = RegisterFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, password } = validatedFields.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    return { message: "Esse nome de usuário já está em uso." };
  }

  const passwordHash = await hashPassword(password);
  // Isolamento Serializable: sem isso, duas contas registradas quase ao
  // mesmo tempo poderiam ler userCount === 0 cada uma e as duas virarem GM.
  const user = await prisma.$transaction(
    async (tx) => {
      const userCount = await tx.user.count();
      const role = userCount === 0 ? "GM" : "PLAYER";
      return tx.user.create({ data: { username, passwordHash, role } });
    },
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
  );

  const session = await getSession();
  session.userId = user.id;
  session.username = user.username;
  session.role = user.role;
  await session.save();

  redirect("/ficha");
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const { username, password } = validatedFields.data;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { message: "Usuário ou senha inválidos." };
  }

  const session = await getSession();
  session.userId = user.id;
  session.username = user.username;
  session.role = user.role;
  await session.save();

  redirect("/ficha");
}

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}

// Exclusão da própria conta (autoatendimento). Apaga o usuário e, em
// cascata (onDelete: Cascade no schema), todas as suas fichas de
// personagem e — se for Mestre — os monstros/NPCs que ele cadastrou
// (compartilhados com a mesa, mas ligados à conta de quem criou).
// Bloqueia se for o único Mestre: sem isso a mesa ficaria sem ninguém
// capaz de promover um novo Mestre depois.
export async function deleteAccountAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const user = await requireUser();

  const confirmUsername = formData.get("confirmUsername");
  if (confirmUsername !== user.username) {
    return { message: "Digite seu usuário exatamente como está escrito para confirmar." };
  }

  if (user.role === "GM") {
    const gmCount = await prisma.user.count({ where: { role: "GM" } });
    if (gmCount <= 1) {
      return {
        message:
          "Você é o único Mestre da mesa. Promova outra pessoa a Mestre antes de excluir sua conta.",
      };
    }
  }

  await prisma.user.delete({ where: { id: user.userId } });

  const session = await getSession();
  session.destroy();
  redirect("/login");
}
