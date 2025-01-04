// File: src/lib/data-access/user/data.ts

"use server";

import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

// Updated UserProfile type
export type UserProfile = {
    id: string;
    username: string;
    role: string;
    email: string;
    profile?: {
        firstName: string;
        lastName: string;
        phoneNo?: string;
    };
    doctor?: {
        department: { name: string };
        specialization: { name: string };
    };
    nurse?: {
        department: { name: string };
        specialization: { name: string };
    };
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
            include: {
                hospital: true,
                profile: true,
                doctor: {
                    include: {
                        department: true,
                        specialization: true,
                    },
                },
                nurse: {
                    include: {
                        department: true,
                        specialization: true,
                    },
                },
            },
        });

        if (!userProfile) {
            Sentry.captureMessage(`User not found: ${userId}`);
            return {
                id: "",
                username: "",
                role: "",
                email: "",
                profile: {
                    firstName: "",
                    lastName: "",
                    phoneNo: "",
                },
                doctor: undefined,
                nurse: undefined,
                hospitalId: null,
                hospital: null,
            };
        }

        return {
            id: userProfile.userId,
            username: userProfile.username,
            role: userProfile.role,
            email: userProfile.email,
            profile: userProfile.profile
                ? {
                      firstName: userProfile.profile.firstName,
                      lastName: userProfile.profile.lastName,
                      phoneNo: userProfile.profile.phoneNo,
                  }
                : {
                      firstName: "",
                      lastName: "",
                      phoneNo: "",
                  },
            doctor: userProfile.doctor
                ? {
                      department: { name: userProfile.doctor.department?.name || "" },
                      specialization: { name: userProfile.doctor.specialization?.name || "" },
                  }
                : undefined,
            nurse: userProfile.nurse
                ? {
                      department: { name: userProfile.nurse.department?.name || "" },
                      specialization: { name: userProfile.nurse.specialization?.name || "" },
                  }
                : undefined,
            hospitalId: userProfile.hospital?.hospitalId || null,
            hospital: userProfile.hospital?.name || null,
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { userId, errorMessage } });
        console.error(`Error fetching user profile for userId=${userId}:`, errorMessage);
        
        // Return empty UserProfile object
        return {
            id: "",
            username: "",
            role: "",
            email: "",
            profile: {
                firstName: "",
                lastName: "",
                phoneNo: "",
            },
            doctor: undefined,
            nurse: undefined,
            hospitalId: null,
            hospital: null,
        };
    }
}
