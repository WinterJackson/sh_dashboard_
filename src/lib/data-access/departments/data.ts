// src/lib/data-access/departments/data.ts

"use server";

import { Department, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

/**
 * Fetches a list of departments based on the user's role and hospital association.
 */
export async function fetchDepartments(
    user?: { role: Role; hospitalId: string | null }
): Promise<Department[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ? session.user.hospitalId.toString() : null,
        };
    }

    try {
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (user.role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all departments
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (!user.hospitalId) {
                    throw new Error(`${user.role}s must have an associated hospital ID.`);
                }
                // Filter departments by hospitalId for other roles
                whereClause.hospitals = {
                    some: {
                        hospitalId: parseInt(user.hospitalId, 10),
                    },
                };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch departments based on the filter criteria
        const departments = await prisma.department.findMany({
            where: whereClause,
            select: {
                departmentId: true,
                name: true,
                hospitals: {
                    select: {
                        hospitalId: true,
                        hospital: {
                            select: {
                                hospitalName: true,
                            },
                        },
                    },
                },
            },
        });

        return departments;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch departments by user:", errorMessage);
        return [];
    }
}