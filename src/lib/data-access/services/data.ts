// src/lib/data-access/services/data.ts

"use server";

import { Service, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

/**
 * Fetches a list of services based on the user's role and hospital/department filters.
 * @param userRole - The role of the current user (e.g., SUPER_ADMIN, ADMIN, etc.).
 * @param userHospitalId - The hospital ID associated with the user.
 * @param selectedDepartmentId - (Optional) Department ID to filter services.
 */
export async function fetchServices(
    user?: { role: Role; hospitalId: number | null },
    selectedDepartmentId?: number
): Promise<Service[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        // Use direct conditional filtering in the `where` clause
        return await prisma.service.findMany({
            where: {
                departments: {
                    some: {
                        departmentId: selectedDepartmentId,
                        department:
                            role !== "SUPER_ADMIN" && hospitalId
                                ? {
                                      hospitals: {
                                          some: { hospitalId },
                                      },
                                  }
                                : undefined,
                    },
                },
            },
            select: { serviceId: true, serviceName: true },
        });
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Failed to fetch services:", errorMessage);
        return [];
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
    currentHospitalId: number,
    user?: { role: Role; hospitalId: number | null }
): Promise<Service[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    try {
        // Directly filter based on department and hospital
        return await prisma.service.findMany({
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
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Failed to fetch filtered services:", errorMessage);
        return [];
    }
}

/**
 * Fetches appointment service data based on the user's role and hospital association.
 * Calculates percentages and filters services based on appointment count.
 */
export async function fetchHospitalServices(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<{ name: string; value: number; percentage: string }[]> {
    // Handle unauthenticated user and session fetching
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    // Extract role and hospitalId from the user object
    const { role, hospitalId } = user;

    try {
        // Variables to store fetched data
        let appointmentServices: { service: { serviceName: string }; appointmentId: string }[] = [];
        let totalAppointments = 0;

        // Fetch data based on user role and hospital association
        if (role === Role.SUPER_ADMIN) {
            // Fetch all appointment services for SUPER_ADMIN
            appointmentServices = await prisma.appointmentService.findMany({
                select: {
                    service: {
                        select: { serviceName: true },
                    },
                    appointmentId: true,
                },
            });

            totalAppointments = await prisma.appointmentService.count();
        } else if (hospitalId) {
            // Fetch data specific to the user's hospital
            appointmentServices = await prisma.appointmentService.findMany({
                where: {
                    appointment: {
                        hospitalId,
                    },
                },
                select: {
                    service: {
                        select: { serviceName: true },
                    },
                    appointmentId: true,
                },
            });

            totalAppointments = await prisma.appointmentService.count({
                where: {
                    appointment: {
                        hospitalId,
                    },
                },
            });
        }

        // Calculate service counts
        const serviceCounts: Record<string, number> = appointmentServices.reduce(
            (acc: Record<string, number>, item) => {
                const serviceName = item.service.serviceName;
                acc[serviceName] = (acc[serviceName] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );

        // Transform data into the required output format
        const transformedData = Object.entries(serviceCounts)
            .filter(([_, count]) => count > 1) // Exclude services with 1 or fewer appointments
            .map(([serviceName, count]) => ({
                name: serviceName,
                value: count,
                percentage: ((count / totalAppointments) * 100).toFixed(2) + "%",
            }));

        return transformedData;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch appointment services:", errorMessage);
        return [];
    }
}
