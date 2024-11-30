// src/lib/session.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = require("@/lib/prisma");

let cachedSession: any = null;
let lastSessionFetchTime: number | null = null;
const SESSION_CACHE_DURATION = 10 * 60 * 1000; // Match with authOptions maxAge (10 minutes)

/**
 * Fetch the server-side session and reuse across components.
 */
export async function getSession() {
    const now = Date.now();

    // Check cache validity
    if (cachedSession && lastSessionFetchTime && now - lastSessionFetchTime < SESSION_CACHE_DURATION) {
        return cachedSession;
    }

    try {
        const session = await getServerSession(authOptions);

        if (session) {
            // Cache the session
            cachedSession = session;
            lastSessionFetchTime = now;
        }

        return session;
    } catch (error) {
        console.error("Error fetching session:", error);
        return null;
    }
}

/**
 * Clear the cached session.
 */
export function clearSessionCache() {
    cachedSession = null;
    lastSessionFetchTime = null;
}

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
