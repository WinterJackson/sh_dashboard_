// src/lib/session.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = require("@/lib/prisma");

/**
 * Fetch a user profile with necessary details only.
 */
export async function getUserProfile(userId: string) {
    return await prisma.profile.findUnique({
        where: { userId },
        include: {
            user: {
                select: {
                    role: true,
                    username: true,
                },
            },
        },
    });
}
