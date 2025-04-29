// src/lib/data-access/specializations/data.ts

"use server";

import { Role, Specialization } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

/**
 * Fetches a list of specializations.
 * @param user - Optional user object with role and hospitalId for validation.
 * @returns List of specializations.
 */
export async function fetchSpecializations(
    user?: { role: Role; hospitalId: number | null }
): Promise<Specialization[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        // Define the filter clause based on the user role
        let whereClause: any = {};

        switch (role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all specializations
                whereClause = {};
                break;

            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                // Filter by hospitalId for ADMIN
                whereClause = {
                    departments: {
                        some: {
                            department: {
                                hospitals: {
                                    some: { hospitalId },
                                },
                            },
                        },
                    },
                };
                break;

            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                // Filter by hospitalId for other roles
                whereClause = {
                    departments: {
                        some: {
                            department: {
                                hospitals: {
                                    some: { hospitalId },
                                },
                            },
                        },
                    },
                };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch specializations based on the filter criteria
        return await prisma.specialization.findMany({
            where: whereClause,
            select: {
                specializationId: true,
                name: true,
                description: true,
                departments: {
                    select: {
                        departmentId: true,
                        department: {
                            select: {
                                departmentName: true,
                            },
                        },
                    },
                },
            },
        });
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Failed to fetch specializations:", errorMessage);
        return [];
    }
}