"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";
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

  const userCount = await prisma.user.count();
  const role = userCount === 0 ? "GM" : "PLAYER";

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username, passwordHash, role },
  });

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
