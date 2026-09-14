import "server-only";
import { prisma } from "@/lib/db";
import type { Way } from "@/generated/prisma/enums";

// Formato de exportação/importação da ficha em .json — usado para
// atualizar uma ficha depois (reimportar um PDF de volta é frágil, ver
// CLAUDE.md). "version" existe para eu poder evoluir o formato sem
// quebrar arquivos exportados antigos.
export const CHARACTER_JSON_VERSION = 1;

export interface CharacterJson {
  version: number;
  exportedAt: string;
  character: Record<string, unknown>;
  ways: { way: Way; rating: number }[];
  domains: {
    domainKey: string;
    rating: number;
    bonus: number;
    penalty: number;
    disciplines: unknown;
  }[];
  items: { type: string; name: string; stats: unknown }[];
}

// Campos que nunca vão no .json exportado nem são aceitos na importação —
// pertencem ao banco/à conta, não à "ficha" em si.
const OMIT_FIELDS = new Set([
  "id",
  "userId",
  "createdAt",
  "updatedAt",
  "creationChoices",
]);

export async function exportCharacterToJson(characterId: string): Promise<CharacterJson> {
  const [character, ways, domains, items] = await Promise.all([
    prisma.characterSheet.findUniqueOrThrow({ where: { id: characterId } }),
    prisma.characterWay.findMany({ where: { characterId } }),
    prisma.characterDomain.findMany({ where: { characterId } }),
    prisma.characterItem.findMany({ where: { characterId } }),
  ]);

  const characterData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(character)) {
    if (!OMIT_FIELDS.has(key)) characterData[key] = value;
  }

  return {
    version: CHARACTER_JSON_VERSION,
    exportedAt: new Date().toISOString(),
    character: characterData,
    ways: ways.map((w) => ({ way: w.way, rating: w.rating })),
    domains: domains.map((d) => ({
      domainKey: d.domainKey,
      rating: d.rating,
      bonus: d.bonus,
      penalty: d.penalty,
      disciplines: d.disciplines,
    })),
    items: items.map((i) => ({ type: i.type, name: i.name, stats: i.stats })),
  };
}

// Campos que aceitamos de volta na importação (allowlist — nunca confiamos
// cegamente em todo o objeto de um arquivo .json que o usuário subiu).
const IMPORTABLE_SCALAR_FIELDS = [
  "status",
  "creationStep",
  "color",
  "origin",
  "occupation",
  "age",
  "experience",
  "advantages",
  "disadvantages",
  "riches",
  "name",
  "traits",
  "personality",
  "background",
  "description",
  "potential",
  "defense",
  "speed",
  "stamina",
  "survivalPoints",
  "survivalPointsCurrent",
  "mentalResistance",
  "healthBoxesChecked",
  "torment",
  "rout",
  "magicPoints",
  "magicPointsCurrent",
  "magicForm",
  "magicBoon",
  "magicFamiliar",
  "ascensionDisgrace",
  "storyArc",
] as const;

export function sanitizeCharacterJson(data: unknown): CharacterJson | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  if (typeof obj.version !== "number") return null;
  if (!obj.character || typeof obj.character !== "object") return null;
  if (!Array.isArray(obj.ways) || !Array.isArray(obj.domains) || !Array.isArray(obj.items)) {
    return null;
  }
  return obj as unknown as CharacterJson;
}

export function pickImportableCharacterFields(
  character: Record<string, unknown>,
): Record<string, unknown> {
  const picked: Record<string, unknown> = {};
  for (const key of IMPORTABLE_SCALAR_FIELDS) {
    if (key in character) picked[key] = character[key];
  }
  return picked;
}
