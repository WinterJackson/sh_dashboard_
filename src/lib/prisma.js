// src/lib/prisma.js file

import { PrismaClient } from '@prisma/client';
const Sentry = require("@sentry/nextjs");

let prisma;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient({
        log: ["query", "info", "warn", "error"],
        datasources: {
            db: {
                url: process.env.POSTGRES_PRISMA_URL
            }
        }
    });
} else {
    global.prisma = global.prisma || new PrismaClient();
    prisma = global.prisma;
}

// Wrap Prisma operations with error handling
prisma.$use(async (params, next) => {
    try {
        return await next(params);
    } catch (error) {
        Sentry.captureException(error);
        console.error('Prisma error:', error);
        await prisma.$disconnect();
        throw error;
    }
});

// Add connection timeout handler
prisma.$on('beforeExit', async () => {
    console.log('Prisma connection closing...');
    await prisma.$disconnect();
});

module.exports = prisma;
