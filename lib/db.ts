import { PrismaClient } from "@prisma/client";
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prisma: PrismaClient;

if (!globalForPrisma.prisma) {
    prisma = new PrismaClient({
        log: ["query", "error", "warn"],
    });
} else {
    prisma = globalForPrisma.prisma;
}

export { prisma };

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
