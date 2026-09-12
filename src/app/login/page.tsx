"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

// Nota: quem já está logado e visita /login continua vendo o formulário
// (login() redireciona só ao submeter). Redirecionar quem já tem sessão
// exigiria checar isso em um Server Component pai — deixado para quando
// isso incomodar de fato, já que submeter de novo não causa dano.

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Tainted Grail</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Entre para acessar suas fichas.
        </p>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm font-medium">
              Usuário
            </label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {state?.errors?.username && (
              <p className="text-sm text-red-600">{state.errors.username[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {state?.errors?.password && (
              <p className="text-sm text-red-600">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity disabled:opacity-60"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-foreground/70">
          Ainda não tem conta?{" "}
          <Link href="/registrar" className="font-medium text-accent">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
