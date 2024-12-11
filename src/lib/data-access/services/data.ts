// src/lib/data-access/services/data.ts

"use server";

import { Service, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

const prisma = require("@/lib/prisma");

/**
 * Fetches a list of services based on the user's role and hospital/department filters.
 * @param userRole - The role of the current user (e.g., SUPER_ADMIN, ADMIN, etc.).
 * @param userHospitalId - The hospital ID associated with the user.
 * @param selectedDepartmentId - (Optional) Department ID to filter services.
 */
export async function fetchServices(
    userRole: Role,
    userHospitalId: number | null,
    selectedDepartmentId?: number
): Promise<Service[]> {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            redirect("/sign-in");
            return [];
        }

        // Construct dynamic `where` clause based on role and filters
        const whereClause: Prisma.ServiceWhereInput = {
            departments: {
                some: {
                    departmentId: selectedDepartmentId,
                    department: userRole !== "SUPER_ADMIN" && userHospitalId
                        ? {
                              hospitals: {
                                  some: { hospitalId: userHospitalId },
                              },
                          }
                        : undefined,
                },
            },
        };

        const services = await prisma.service.findMany({
            where: whereClause,
            select: { serviceId: true, serviceName: true },
        });

        return services;
    } catch (error) {
        Sentry.captureException(error);
        throw new Error("Failed to fetch services");
    }
}


/**
 * Retrieves a filtered list of services based on the selected department and hospital.
 * This function is used in the "Add New Doctor" page to dynamically populate the 
 * services dropdown based on the selected department and the user's hospital.
 *
 * @param {number} selectedDepartmentId - The ID of the selected department.
 * @param {number} currentHospitalId - The ID of the current hospital based on user role or selection.
 *
 */
export async function filteredServices(
    selectedDepartmentId: number,
    currentHospitalId: number
): Promise<Service[]> {
    try {
        const services = await prisma.service.findMany({
            where: {
                departments: {
                    some: {
                        departmentId: selectedDepartmentId,
                        department: {
                            hospitals: {
                                some: { hospitalId: currentHospitalId },
                            },
                        },
                    },
                },
            },
            select: { serviceId: true, serviceName: true },
        });

        return services;
    } catch (error) {
        Sentry.captureException(error);
        throw new Error("Failed to fetch filtered services");
    }
}
