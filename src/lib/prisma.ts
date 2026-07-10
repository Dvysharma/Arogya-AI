import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | null = null;

if (typeof window === "undefined" && process.env.DATABASE_URL) {
  try {
    prismaInstance =
      globalForPrisma.prisma ??
      new PrismaClient();

    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = prismaInstance;
    }
  } catch (error) {
    console.error("Prisma client instantiation error:", error);
  }
}

export const prisma = prismaInstance;

