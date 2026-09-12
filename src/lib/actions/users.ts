"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireGM } from "@/lib/dal";

// Promove um Jogador a Mestre. Só quem já é Mestre pode chamar isso —
// atende ao pedido do usuário: a mesa pode ter mais de um Mestre, e quem
// já é Mestre decide promover outra pessoa (não precisa ser sempre a
// primeira conta criada).
export async function promoteToGMAction(formData: FormData) {
  await requireGM();

  const userId = formData.get("userId");
  if (typeof userId !== "string" || !userId) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: "GM" },
  });

  revalidatePath("/mestre");
}
