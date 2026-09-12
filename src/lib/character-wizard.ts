import "server-only";
import { redirect } from "next/navigation";
import type { CharacterSheet } from "@/generated/prisma/client";

// Impede pular etapas: só deixa acessar a etapa N se as N-1 anteriores já
// foram concluídas (creationStep >= N-1). Se a ficha já estiver completa,
// manda para a visualização em vez do assistente.
export function enforceStepAccess(character: CharacterSheet, step: number) {
  if (character.status === "COMPLETE") {
    redirect(`/ficha/${character.id}`);
  }
  if (step > character.creationStep + 1) {
    redirect(`/ficha/${character.id}/etapa/${character.creationStep + 1}`);
  }
}
