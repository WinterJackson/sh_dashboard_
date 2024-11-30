// src/lib/session.ts

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const prisma = require("@/lib/prisma");

let cachedSession: any = null; // Cache the session to avoid redundant fetches
let lastSessionFetchTime: number | null = null; // Timestamp of the last session fetch
const SESSION_CACHE_DURATION = 10 * 60 * 1000; // Match with authOptions maxAge (10 minutes)

/**
 * Fetch the server-side session once and reuse it across the application.
 * Invalidate the cache if the session is expired or user signs out.
 */
export async function getSession(req?: Request) {
    try {
        const now = Date.now();

        // Validate the cached session
        if (cachedSession && lastSessionFetchTime && now - lastSessionFetchTime < SESSION_CACHE_DURATION) {
            // Check if sessionToken exists before querying
            if (cachedSession.token) {
                const sessionExists = await prisma.session.findUnique({
                    where: { sessionToken: cachedSession.token },
                });

                // Return cached session if valid
                if (sessionExists) {
                    return cachedSession;
                }

                // Clear invalid session cache
                clearSessionCache();
            } else {
                // Clear cache if token is missing
                clearSessionCache();
            }
        }

        // Fetch a fresh session from the server
        const session = await getServerSession(authOptions);

        // Cache the session if valid
        if (session) {
            cachedSession = session;
            lastSessionFetchTime = now;
            return session;
        }

        // No session found, throw an error
        throw new Error("Failed to fetch session.");
    } catch (error) {
        // Log error and return null
        console.error("Error fetching session:", error);
        return null;
    }
}

/**
 * Clear session cache manually (used on sign out).
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
