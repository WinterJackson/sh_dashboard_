// src/lib/data-access/services/data.ts

"use server";

import { Service, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

import prisma from "@/lib/prisma";

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
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all services
                whereClause = {
                    departments: {
                        some: {
                            departmentId: selectedDepartmentId,
                        },
                    },
                };
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Filter by hospitalId for other roles
                whereClause = {
                    departments: {
                        some: {
                            departmentId: selectedDepartmentId,
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

        // Fetch services based on the filter criteria
        return await prisma.service.findMany({
            where: whereClause,
            select: {
                serviceId: true,
                serviceName: true,
                type: true,
            },
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
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all services
                whereClause = {
                    departments: {
                        some: {
                            departmentId: selectedDepartmentId,
                        },
                    },
                };
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Filter by hospitalId for other roles
                whereClause = {
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
                };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch services based on the filter criteria
        return await prisma.service.findMany({
            where: whereClause,
            select: {
                serviceId: true,
                serviceName: true,
                type: true,
            },
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
 * Calculates percentages and filters services based on their type and appointment count.
 */
export async function fetchHospitalServices(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<{ name: string; value: number; percentage: string }[]> {
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
        let appointmentServices: {
            service: { serviceName: string };
            appointmentId: string;
        }[] = [];
        let totalAppointments = 0;

        if (role === "SUPER_ADMIN") {
            // Fetch all appointments for health-related services
            appointmentServices = await prisma.appointmentService.findMany({
                where: {
                    service: {
                        type: "MEDICAL",
                    },
                    ...(hospitalId !== null && {
                        appointment: { hospitalId },
                    }),
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
                    service: {
                        type: "MEDICAL",
                    },
                    ...(hospitalId !== null && {
                        appointment: { hospitalId },
                    }),
                },
            });
        } else if (hospitalId) {
            // Fetch appointments for health-related services in the user's hospital
            appointmentServices = await prisma.appointmentService.findMany({
                where: {
                    appointment: {
                        hospitalId,
                    },
                    service: {
                        type: "MEDICAL",
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
                    service: {
                        type: "MEDICAL",
                    },
                },
            });
        }

        // Calculate service counts
        const serviceCounts: Record<string, number> =
            appointmentServices.reduce((acc: Record<string, number>, item) => {
                const serviceName = item.service.serviceName;
                acc[serviceName] = (acc[serviceName] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

        // Transform data into the required output format
        const transformedData = Object.entries(serviceCounts)
            .filter(([_, count]) => count > 1) // Exclude services with 1 or fewer appointments
            .map(([serviceName, count]) => ({
                name: serviceName,
                value: count,
                percentage:
                    ((count / totalAppointments) * 100).toFixed(2) + "%",
            }));

        return transformedData;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch appointment services:", errorMessage);
        return [];
    }
}
