"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser, requireOwnedCharacter } from "@/lib/dal";
import {
  sanitizeCharacterJson,
  pickImportableCharacterFields,
} from "@/lib/character-json";
import { sanitizeJsonDeep } from "@/lib/sanitize-text";
import type { Way } from "@/generated/prisma/enums";
import type { ItemType } from "@/generated/prisma/enums";

export type ImportFormState = { message?: string } | undefined;

async function parseUploadedJson(formData: FormData): Promise<
  { ok: true; data: ReturnType<typeof sanitizeCharacterJson> } | { ok: false; message: string }
> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Escolha um arquivo .json exportado do app." };
  }
  if (file.size > 2_000_000) {
    return { ok: false, message: "Arquivo grande demais (máx. 2MB)." };
  }
  let parsed: unknown;
  try {
    parsed = sanitizeJsonDeep(JSON.parse(await file.text()));
  } catch {
    return { ok: false, message: "Arquivo não é um .json válido." };
  }
  const data = sanitizeCharacterJson(parsed);
  if (!data) {
    return { ok: false, message: "Esse .json não tem o formato esperado de uma ficha exportada daqui." };
  }
  return { ok: true, data };
}

async function writeImportedCharacter(characterId: string, data: NonNullable<ReturnType<typeof sanitizeCharacterJson>>) {
  const fields = pickImportableCharacterFields(data.character);

  await prisma.$transaction([
    prisma.characterSheet.update({ where: { id: characterId }, data: fields }),
    prisma.characterWay.deleteMany({ where: { characterId } }),
    prisma.characterDomain.deleteMany({ where: { characterId } }),
    prisma.characterItem.deleteMany({ where: { characterId } }),
    ...data.ways.map((w) =>
      prisma.characterWay.create({
        data: { characterId, way: w.way as Way, rating: w.rating },
      }),
    ),
    ...data.domains.map((d) =>
      prisma.characterDomain.create({
        data: {
          characterId,
          domainKey: d.domainKey,
          rating: d.rating,
          bonus: d.bonus,
          penalty: d.penalty,
          disciplines: d.disciplines ?? undefined,
        },
      }),
    ),
    ...data.items.map((i) =>
      prisma.characterItem.create({
        data: {
          characterId,
          type: i.type as ItemType,
          name: i.name,
          stats: i.stats ?? undefined,
        },
      }),
    ),
  ]);
}

// Importa criando uma ficha NOVA para o usuário logado.
export async function importNewCharacterAction(
  _prev: ImportFormState,
  formData: FormData,
): Promise<ImportFormState> {
  const user = await requireUser();
  const result = await parseUploadedJson(formData);
  if (!result.ok) return { message: result.message };
  const data = result.data!;

  const character = await prisma.characterSheet.create({ data: { userId: user.userId } });
  await writeImportedCharacter(character.id, data);
  redirect(`/ficha/${character.id}`);
}

// Reimporta um .json para ATUALIZAR uma ficha já existente do usuário.
export async function importUpdateCharacterAction(
  characterId: string,
  _prev: ImportFormState,
  formData: FormData,
): Promise<ImportFormState> {
  const character = await requireOwnedCharacter(characterId);
  const result = await parseUploadedJson(formData);
  if (!result.ok) return { message: result.message };
  const data = result.data!;

  await writeImportedCharacter(character.id, data);
  revalidatePath(`/ficha/${character.id}`);
  redirect(`/ficha/${character.id}`);
}
