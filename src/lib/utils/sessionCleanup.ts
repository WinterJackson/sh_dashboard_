// src/lib/utils/sessionCleanup.ts file

"use server";

import prisma from "@/lib/prisma";

/**
 * Cleanup expired sessions periodically.
 */
async function cleanupExpiredSessions() {
    const now = new Date();

    await prisma.session.deleteMany({
        where: {
            expires: { lt: now },
        },
    });
}

// Schedule this function to run at regular intervals (e.g., every 15 minutes)
setInterval(cleanupExpiredSessions, 15 * 60 * 1000);

