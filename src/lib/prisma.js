// src/lib/prisma.js file

import { PrismaClient } from '@prisma/client';
const Sentry = require("@sentry/nextjs");

let prisma;

if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    global.prisma = global.prisma || new PrismaClient();
    prisma = global.prisma;
}

// Wrap Prisma operations
prisma.$use(async (params, next) => {
    try {
        return await next(params);
    } catch (error) {
        Sentry.captureException(error);
        await prisma.$disconnect();
        throw error;
    }
});

module.exports = prisma;
