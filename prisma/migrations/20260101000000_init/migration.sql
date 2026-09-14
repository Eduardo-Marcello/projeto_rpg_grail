-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PLAYER', 'GM');

-- CreateEnum
CREATE TYPE "CharacterStatus" AS ENUM ('DRAFT', 'COMPLETE');

-- CreateEnum
CREATE TYPE "Way" AS ENUM ('AWARENESS', 'COMBATIVENESS', 'CREATIVITY', 'CONVICTION', 'REASON');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('WEAPON', 'ARMOR', 'EQUIPMENT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PLAYER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_sheets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CharacterStatus" NOT NULL DEFAULT 'DRAFT',
    "creationStep" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT,
    "origin" TEXT,
    "occupation" TEXT,
    "age" INTEGER,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "advantages" JSONB,
    "disadvantages" JSONB,
    "riches" INTEGER NOT NULL DEFAULT 5,
    "name" TEXT,
    "traits" JSONB,
    "personality" TEXT,
    "background" TEXT,
    "description" TEXT,
    "potential" INTEGER NOT NULL DEFAULT 1,
    "defense" INTEGER NOT NULL DEFAULT 0,
    "speed" INTEGER NOT NULL DEFAULT 0,
    "stamina" INTEGER NOT NULL DEFAULT 10,
    "survivalPoints" INTEGER NOT NULL DEFAULT 3,
    "survivalPointsCurrent" INTEGER,
    "mentalResistance" INTEGER NOT NULL DEFAULT 0,
    "healthBoxesChecked" INTEGER NOT NULL DEFAULT 0,
    "torment" TEXT,
    "rout" TEXT,
    "magicPoints" INTEGER NOT NULL DEFAULT 0,
    "magicPointsCurrent" INTEGER,
    "magicForm" TEXT,
    "magicBoon" TEXT,
    "magicFamiliar" TEXT,
    "ascensionDisgrace" INTEGER NOT NULL DEFAULT 0,
    "storyArc" JSONB,
    "creationChoices" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "character_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_ways" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "way" "Way" NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "character_ways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_domains" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "domainKey" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "bonus" INTEGER NOT NULL DEFAULT 0,
    "penalty" INTEGER NOT NULL DEFAULT 0,
    "disciplines" JSONB,

    CONSTRAINT "character_domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "character_items" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "type" "ItemType" NOT NULL,
    "name" TEXT NOT NULL,
    "stats" JSONB,

    CONSTRAINT "character_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "monsters_npcs" (
    "id" TEXT NOT NULL,
    "gmId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wyrdnessLevel" INTEGER,
    "stats" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "monsters_npcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dice_roll_logs" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "command" TEXT NOT NULL,
    "breakdown" TEXT NOT NULL,
    "result" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dice_roll_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "character_ways_characterId_way_key" ON "character_ways"("characterId", "way");

-- CreateIndex
CREATE UNIQUE INDEX "character_domains_characterId_domainKey_key" ON "character_domains"("characterId", "domainKey");

-- AddForeignKey
ALTER TABLE "character_sheets" ADD CONSTRAINT "character_sheets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_ways" ADD CONSTRAINT "character_ways_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "character_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_domains" ADD CONSTRAINT "character_domains_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "character_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "character_items" ADD CONSTRAINT "character_items_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "character_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "monsters_npcs" ADD CONSTRAINT "monsters_npcs_gmId_fkey" FOREIGN KEY ("gmId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dice_roll_logs" ADD CONSTRAINT "dice_roll_logs_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "character_sheets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

