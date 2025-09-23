// src/lib/prisma.Js file

import { PrismaClient } from "@prisma/client";
import * as Sentry from "@sentry/nextjs";

// Initialize Sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
});

// Global singleton reference (to avoid reinitializing in development)
const globalForPrisma = globalThis;

const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log:
            process.env.NODE_ENV === "production"
                ? ["warn", "error"]
                : ["query", "info", "warn", "error"], // with prisma logs on terminal
        // : [], // with no logs on terminal
    });

// Global error tracking
prisma.$use(async (params, next) => {
    try {
        return await next(params);
    } catch (error) {
        Sentry.captureException(error);
        await prisma.$disconnect();
        throw error;
    }
});

// Avoid creating new client on every hot reload
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export default prisma;
