import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { requireOwnedCharacter } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { CharacterSheetDocument } from "@/components/pdf/CharacterSheetDocument";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const character = await requireOwnedCharacter(id);
  const [ways, domains, items] = await Promise.all([
    prisma.characterWay.findMany({ where: { characterId: character.id } }),
    prisma.characterDomain.findMany({ where: { characterId: character.id } }),
    prisma.characterItem.findMany({ where: { characterId: character.id } }),
  ]);

  const buffer = await renderToBuffer(
    <CharacterSheetDocument
      name={character.name}
      color={character.color}
      origin={character.origin}
      occupation={character.occupation}
      age={character.age}
      ways={ways}
      domains={domains}
      potential={character.potential}
      defense={character.defense}
      speed={character.speed}
      stamina={character.stamina}
      survivalPoints={character.survivalPoints}
      survivalPointsCurrent={character.survivalPointsCurrent}
      mentalResistance={character.mentalResistance}
      healthBoxesChecked={character.healthBoxesChecked}
      torment={character.torment}
      rout={character.rout}
      magicPoints={character.magicPoints}
      magicPointsCurrent={character.magicPointsCurrent}
      riches={character.riches}
      items={items}
      advantages={character.advantages}
      disadvantages={character.disadvantages}
      traits={character.traits}
      personality={character.personality}
      background={character.background}
      description={character.description}
      storyArc={character.storyArc}
    />,
  );

  const filename = `${(character.name ?? "ficha").replace(/[^a-z0-9-_]+/gi, "_")}.pdf`;
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
