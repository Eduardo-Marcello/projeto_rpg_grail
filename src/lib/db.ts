import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Singleton do Prisma Client (Prisma 7 exige um driver adapter — ver
// .agents/skills/prisma-upgrade-v7/references/driver-adapters.md).
// Usamos @prisma/adapter-pg (driver `pg`, protocolo Postgres padrão): ele
// funciona tanto contra o Postgres local de desenvolvimento (`npx prisma
// dev`) quanto contra a Neon em produção (decisão registrada em
// Tainted Grail/CLAUDE.md), sem precisar de dois caminhos de código.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
