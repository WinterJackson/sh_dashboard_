// File: src/lib/data-access/user/data.ts

"use server";

import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

// Define UserProfile type directly in this file
export type UserProfile = {
    id: string;
    username: string;
    role: string;
    hospitalId: number | null;
    hospital: string | null;
};

/**
 * Fetch user profile by user ID.
 * @param userId - The ID of the user to fetch the profile for.
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile> {
    try {
        const userProfile = await prisma.user.findUnique({
            where: { userId },
            include: { hospital: true },
        });

        if (!userProfile) {
            Sentry.captureMessage(`User not found: ${userId}`);
            throw new Error("User not found");
        }

        return {
            id: userProfile.userId,
            username: userProfile.username,
            role: userProfile.role,
            hospitalId: userProfile.hospital?.hospitalId || null,
            hospital: userProfile.hospital?.name || null,
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { userId, errorMessage } });
        console.error(`Error fetching user profile for userId=${userId}:`, errorMessage);
        throw new Error("Failed to fetch user profile.");
    }
}
