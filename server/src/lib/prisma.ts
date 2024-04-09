import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
    // Vai dá print no terminal de todas as querys que são executadas pelo BD
    log: ['query'],
})