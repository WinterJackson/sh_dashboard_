// src/lib/data-access/user/data.ts

"use server";

import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

import prisma from "@/lib/prisma";

export type UserProfile = {
    id: string;
    username: string;
    role: string;
    email: string;
    profile?: {
        firstName: string;
        lastName: string;
        phoneNo?: string | null;
    };
    doctor?: {
        department: { name: string };
        specialization: { name: string };
        hospital: { hospitalName: string };
    };
    nurse?: {
        department: { name: string };
        specialization: { name: string };
        hospital: { hospitalName: string };
    };
    hospitalId: number | null;
    hospitalName: string | null;
};

/**
 * Fetch user profile by user ID with hybrid validation.
 * @param userId - The ID of the user to fetch the profile for (optional).
 */
export async function fetchUserProfile(userId?: string): Promise<UserProfile> {
    try {
        if (!userId) {
            const session = await getServerSession(authOptions);

            if (!session || !session?.user) {
                console.error(
                    "Session fetch failed or user not authenticated."
                );
                return {
                    id: "",
                    username: "",
                    role: "",
                    email: "",
                    profile: {
                        firstName: "",
                        lastName: "",
                        phoneNo: null,
                    },
                    doctor: undefined,
                    nurse: undefined,
                    hospitalId: null,
                    hospitalName: null,
                };
            }

            userId = session.user.id;
        }

        const userProfile = await prisma.user.findUnique({
            where: { userId },
            include: {
                profile: true,
                doctor: {
                    include: {
                        department: true,
                        specialization: true,
                        hospital: {
                            select: {
                                hospitalId: true,
                                hospitalName: true,
                            },
                        },
                    },
                },
                nurse: {
                    include: {
                        department: true,
                        specialization: true,
                        hospital: {
                            select: {
                                hospitalId: true,
                                hospitalName: true,
                            },
                        },
                    },
                },
                hospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
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
                    phoneNo: null,
                },
                doctor: undefined,
                nurse: undefined,
                hospitalId: null,
                hospitalName: null,
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
                      phoneNo: userProfile.profile.phoneNo || null,
                  }
                : {
                      firstName: "",
                      lastName: "",
                      phoneNo: null,
                  },
            doctor: userProfile.doctor
                ? {
                      department: {
                          name: userProfile.doctor.department?.name || "",
                      },
                      specialization: {
                          name: userProfile.doctor.specialization?.name || "",
                      },
                      hospital: {
                          hospitalName:
                              userProfile.doctor.hospital?.hospitalName || "",
                      },
                  }
                : undefined,
            nurse: userProfile.nurse
                ? {
                      department: {
                          name: userProfile.nurse.department?.name || "",
                      },
                      specialization: {
                          name: userProfile.nurse.specialization?.name || "",
                      },
                      hospital: {
                          hospitalName:
                              userProfile.nurse.hospital?.hospitalName || "",
                      },
                  }
                : undefined,
            hospitalId: userProfile.hospital?.hospitalId || null,
            hospitalName: userProfile.hospital?.hospitalName || null,
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { userId, errorMessage } });
        console.error(
            `Error fetching user profile for userId=${userId}:`,
            errorMessage
        );

        // Return empty UserProfile object
        return {
            id: "",
            username: "",
            role: "",
            email: "",
            profile: {
                firstName: "",
                lastName: "",
                phoneNo: null,
            },
            doctor: undefined,
            nurse: undefined,
            hospitalId: null,
            hospitalName: null,
        };
    }
}

export async function markOnboardingComplete(userId: string) {
    try {
        const updatedUser = await prisma.user.update({
            where: { userId },
            data: { hasCompletedOnboarding: true },
        });
        return updatedUser;
    } catch (error) {
        console.error("Error marking onboarding complete:", error);
        throw new Error("Failed to update onboarding status");
    }
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
