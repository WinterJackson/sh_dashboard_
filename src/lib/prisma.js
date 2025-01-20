// src/lib/prisma.js file

const { PrismaClient } = require("@prisma/client");
const Sentry = require("@sentry/nextjs");

// singleton global reference
const globalForPrisma = globalThis;

// Initialize, with error handling
const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log:
            process.env.NODE_ENV === "production"
                ? ["warn", "error"]
                : ["query", "info", "warn", "error"],
    });

// middleware for error tracking
prisma.$use(async (params, next) => {
    try {
        return await next(params);
    } catch (error) {
        Sentry.captureException(error);
        await prisma.$disconnect();
        throw error;
    }
});

// Preserve instance in development
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

module.exports = prisma;
