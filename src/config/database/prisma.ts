import { PrismaClient } from "@prisma/client";

/** Singleton do PrismaClient — nunca instancie `new PrismaClient()` espalhado. */
export const prisma = new PrismaClient();

/** Conecta ao banco no arranque (fail-fast se o SQLite não estiver acessível). */
export async function databaseInit(): Promise<void> {
  await prisma.$connect();
}
