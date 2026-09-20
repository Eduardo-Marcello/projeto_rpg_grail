"use server";

import { redirect } from "next/navigation";
import { revalidatePath, refresh } from "next/cache";
import { prisma } from "@/lib/db";
import { requireGM, requireMonster } from "@/lib/dal";
import { fromJson, toJsonInput } from "@/lib/character-domains";
import { EMPTY_MONSTER_STATS, type MonsterStats } from "@/lib/monster-stats";

// Cadastro de monstros/NPCs (Fase 5) — p.367-369 do corebook. Compartilhado
// entre todos os Mestres da mesa (ver requireMonster em dal.ts).

async function afterEdit(monsterId: string) {
  revalidatePath(`/mestre/${monsterId}`);
  revalidatePath("/mestre");
  refresh();
}

function loadStats(monster: { stats: unknown }): MonsterStats {
  return fromJson<MonsterStats>(monster.stats, EMPTY_MONSTER_STATS);
}

export async function createMonsterAction(formData: FormData) {
  const gm = await requireGM();
  const name = formData.get("name");
  const monster = await prisma.monsterOrNpc.create({
    data: {
      gmId: gm.userId,
      name: typeof name === "string" && name.trim() ? name.trim() : "Novo monstro/NPC",
      stats: toJsonInput(EMPTY_MONSTER_STATS),
    },
  });
  revalidatePath("/mestre");
  redirect(`/mestre/${monster.id}`);
}

// Irreversível; a confirmação fica a cargo da UI (ver DeleteMonsterButton).
// Sempre redireciona para /mestre, tanto na lista quanto na página de detalhe.
export async function deleteMonsterAction(monsterId: string) {
  await requireMonster(monsterId);
  await prisma.monsterOrNpc.delete({ where: { id: monsterId } });
  revalidatePath("/mestre");
  redirect("/mestre");
}

// --- Informações gerais ---
export async function updateMonsterBasicsAction(monsterId: string, formData: FormData) {
  const monster = await requireMonster(monsterId);
  const stats = loadStats(monster);
  const name = formData.get("name");
  const wyrdnessLevel = formData.get("wyrdnessLevel");
  const overview = formData.get("overview");
  const description = formData.get("description");
  const notes = formData.get("notes");

  const level = typeof wyrdnessLevel === "string" && wyrdnessLevel.trim() !== ""
    ? Number(wyrdnessLevel)
    : null;

  await prisma.monsterOrNpc.update({
    where: { id: monster.id },
    data: {
      name: typeof name === "string" && name.trim() ? name.trim() : monster.name,
      wyrdnessLevel: level != null && Number.isFinite(level) ? level : null,
      notes: typeof notes === "string" ? notes : null,
      stats: toJsonInput({
        ...stats,
        overview: typeof overview === "string" ? overview : stats.overview,
        description: typeof description === "string" ? description : stats.description,
      } satisfies MonsterStats),
    },
  });
  await afterEdit(monster.id);
}

// --- Estatísticas de combate (p.368) ---
export async function updateMonsterCombatStatsAction(monsterId: string, formData: FormData) {
  const monster = await requireMonster(monsterId);
  const stats = loadStats(monster);

  function num(field: string, fallback: number): number {
    const raw = formData.get(field);
    const n = typeof raw === "string" && raw.trim() !== "" ? Number(raw) : NaN;
    return Number.isFinite(n) ? n : fallback;
  }

  const weaponLabel = formData.get("weaponLabel");
  const healthRaw = formData.get("health");
  const health =
    typeof healthRaw === "string"
      ? healthRaw
          .split("/")
          .map((s) => Number(s.trim()))
          .filter((n) => Number.isFinite(n) && n > 0)
      : stats.health;

  await prisma.monsterOrNpc.update({
    where: { id: monster.id },
    data: {
      stats: toJsonInput({
        ...stats,
        attack: num("attack", stats.attack),
        weaponLabel: typeof weaponLabel === "string" ? weaponLabel : stats.weaponLabel,
        damage: num("damage", stats.damage),
        defense: num("defense", stats.defense),
        protection: num("protection", stats.protection),
        speed: num("speed", stats.speed),
        potential: num("potential", stats.potential),
        health,
        stamina: num("stamina", stats.stamina),
        mentalResistance: num("mentalResistance", stats.mentalResistance),
      } satisfies MonsterStats),
    },
  });
  await afterEdit(monster.id);
}

// --- Traços (p.368: "Traits") ---
export async function addTraitAction(monsterId: string, name: string, description: string) {
  const monster = await requireMonster(monsterId);
  if (!name.trim()) return;
  const stats = loadStats(monster);
  stats.traits.push({ name: name.trim(), description: description.trim() });
  await prisma.monsterOrNpc.update({
    where: { id: monster.id },
    data: { stats: toJsonInput(stats) },
  });
  await afterEdit(monster.id);
}

export async function removeTraitAction(monsterId: string, index: number) {
  const monster = await requireMonster(monsterId);
  const stats = loadStats(monster);
  stats.traits.splice(index, 1);
  await prisma.monsterOrNpc.update({
    where: { id: monster.id },
    data: { stats: toJsonInput(stats) },
  });
  await afterEdit(monster.id);
}

// --- Habilidades Especiais (p.368: "Special Abilities") ---
export async function addSpecialAbilityAction(
  monsterId: string,
  name: string,
  description: string,
) {
  const monster = await requireMonster(monsterId);
  if (!name.trim()) return;
  const stats = loadStats(monster);
  stats.specialAbilities.push({ name: name.trim(), description: description.trim() });
  await prisma.monsterOrNpc.update({
    where: { id: monster.id },
    data: { stats: toJsonInput(stats) },
  });
  await afterEdit(monster.id);
}

export async function removeSpecialAbilityAction(monsterId: string, index: number) {
  const monster = await requireMonster(monsterId);
  const stats = loadStats(monster);
  stats.specialAbilities.splice(index, 1);
  await prisma.monsterOrNpc.update({
    where: { id: monster.id },
    data: { stats: toJsonInput(stats) },
  });
  await afterEdit(monster.id);
}

// --- Domínios/Disciplinas relevantes (p.368, ex: "Perception: 10") ---
export async function addSkillAction(monsterId: string, name: string, rating: number) {
  const monster = await requireMonster(monsterId);
  if (!name.trim()) return;
  const stats = loadStats(monster);
  stats.skills.push({ name: name.trim(), rating: Number.isFinite(rating) ? rating : 0 });
  await prisma.monsterOrNpc.update({
    where: { id: monster.id },
    data: { stats: toJsonInput(stats) },
  });
  await afterEdit(monster.id);
}

export async function removeSkillAction(monsterId: string, index: number) {
  const monster = await requireMonster(monsterId);
  const stats = loadStats(monster);
  stats.skills.splice(index, 1);
  await prisma.monsterOrNpc.update({
    where: { id: monster.id },
    data: { stats: toJsonInput(stats) },
  });
  await afterEdit(monster.id);
}
