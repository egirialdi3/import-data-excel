// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
    // Agar tidak membuat instance baru saat development (hot reload)
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const prisma =
    global.prisma || new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
    });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
