import Link from "next/link";
import { requireUser } from "@/lib/dal";
import { logoutAction } from "@/lib/actions/auth";

const TABS = [
  { href: "/ficha", label: "Ficha" },
  { href: "/como-jogar", label: "Como Jogar" },
  { href: "/mesa", label: "Mesa de Dados" },
] as const;

export default async function AppLayout({ children }: LayoutProps<"/">) {
  // DAL: redireciona para /login se não houver sessão válida.
  const user = await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="text-lg font-semibold tracking-tight">
            Tainted Grail
          </span>
          <div className="flex items-center gap-3 text-sm text-foreground/70">
            <span>
              {user.username}{" "}
              <span className="text-foreground/50">
                ({user.role === "GM" ? "Mestre" : "Jogador"})
              </span>
            </span>
            <Link href="/conta" className="font-medium text-accent">
              Minha Conta
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="font-medium text-accent">
                Sair
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-4xl gap-1 px-4">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="rounded-t-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-background"
            >
              {tab.label}
            </Link>
          ))}
          {user.role === "GM" && (
            <Link
              href="/mestre"
              className="rounded-t-md px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-background"
            >
              Mestre
            </Link>
          )}
        </nav>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
        {children}
      </main>
    </div>
  );
}
