// src/lib/data-access/departments/data.ts

"use server";

import { Department, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");

/**
 * Fetches a list of departments based on the user's role and hospital association.
 */
export async function fetchDepartments(user: {
    role: Role;
    hospitalId: string | null;
}): Promise<Department[]> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
        return [];
    }

    try {
        if (user.role === "SUPER_ADMIN") {
            // SUPER_ADMIN gets access to all departments
            return await prisma.department.findMany({
                select: {
                    departmentId: true,
                    name: true,
                    hospitals: {
                        select: {
                            hospitalId: true,
                            hospital: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
        } else if (user.hospitalId) {
            // Other roles get access to departments tied to their hospital
            return await prisma.department.findMany({
                where: {
                    hospitals: {
                        some: {
                            hospitalId: parseInt(user.hospitalId, 10), // Ensure hospitalId is an integer
                        },
                    },
                },
                select: {
                    departmentId: true,
                    name: true,
                    hospitals: {
                        select: {
                            hospitalId: true,
                            hospital: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
        }
        return [];
    } catch (error) {
        Sentry.captureException(error);
        throw new Error("Failed to fetch departments by user");
    }
}
