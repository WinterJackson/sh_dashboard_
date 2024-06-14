// src/lib/sessionCleanup.ts file

const prisma = require ("@/lib/prisma");

async function cleanupExpiredSessions() {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

    await prisma.session.deleteMany({
        where: {
            expires: { lt: now },
            OR: [
                {
                    expires: { lt: thirtyMinutesAgo },
                },
            ],
        },
    });
}

// Schedule this function to run at regular intervals, e.g., every 15 minutes
setInterval(cleanupExpiredSessions, 15 * 60 * 1000);
