import { requireUser } from "@/lib/dal";
import { DeleteAccountForm } from "@/components/account/DeleteAccountForm";

export default async function ContaPage() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold">Minha Conta</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Usuário: <strong>{user.username}</strong> — papel:{" "}
          {user.role === "GM" ? "Mestre" : "Jogador"}
        </p>
      </div>

      <section className="rounded-md border border-red-600/30 bg-red-600/5 p-4">
        <h2 className="mb-2 text-lg font-semibold text-red-600">Excluir conta</h2>
        <DeleteAccountForm username={user.username} />
      </section>
    </div>
  );
}
