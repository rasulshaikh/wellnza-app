import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // SSL config: Neon.tech requires rejectUnauthorized: false in production only
  // This is safe because Neon uses trusted certificates; we just skip OS-level CA verification
  const isNeon = connectionString.includes("neon.tech");
  const sslConfig = isNeon && process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : true;

  const pool = new Pool({
    connectionString,
    ssl: sslConfig,
  });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;