import { NextResponse } from "next/server";
import { requireOwnedCharacter } from "@/lib/dal";
import { exportCharacterToJson } from "@/lib/character-json";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  const json = await exportCharacterToJson(character.id);

  const filename = `${(character.name ?? "ficha").replace(/[^a-z0-9-_]+/gi, "_")}.json`;
  return new NextResponse(JSON.stringify(json, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
