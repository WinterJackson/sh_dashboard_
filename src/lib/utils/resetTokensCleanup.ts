// src/lib/utils/resetTokensCleanup.ts

import prisma from "@/lib/prisma";

async function cleanupExpiredResetTokens() {
    try {
        const result = await prisma.user.updateMany({
            where: {
                resetTokenExpiry: {
                    lt: new Date(),
                },
            },
            data: {
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        console.log(
            `✅ Cleanup complete. ${result.count} user(s) had expired reset tokens removed.`
        );
    } catch (error) {
        console.error("❌ Error cleaning up expired reset tokens:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupExpiredResetTokens();
