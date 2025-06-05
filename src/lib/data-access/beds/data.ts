// File: src/lib/data-access/beds/data.ts

"use server";

import { Bed, BedAvailability, BedCapacity, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

import prisma from "@/lib/prisma";

/**
 * Fetch available beds based on user's role and hospitalId.
 */
export async function fetchAvailableBeds(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<{ beds: Bed[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { beds: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = { availability: BedAvailability.AVAILABLE };

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all available beds
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
                whereClause.hospitalId = hospitalId;
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch available beds based on the filter criteria
        const beds = await prisma.bed.findMany({
            where: whereClause,
            include: {
                hospital: {
                    select: {
                        hospitalName: true,
                        hospitalId: true,
                    },
                },
            },
        });

        return { beds };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching available beds:", errorMessage);
        return { beds: [] };
    }
}

/**
 * Fetch count of available beds based on user's role and hospitalId.
 */
export async function fetchAvailableBedsCount(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<number> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return 0;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = { availability: BedAvailability.AVAILABLE };

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all available beds
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
                whereClause.hospitalId = hospitalId;
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Count available beds based on the filter criteria
        const availableBedsCount = await prisma.bed.count({
            where: whereClause,
        });

        return availableBedsCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching available beds count:", errorMessage);
        return 0;
    }
}

/**
 * Fetch occupied beds based on user's role and hospitalId.
 */
export async function fetchOccupiedBeds(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<{ beds: Bed[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { beds: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = { availability: "Occupied" };

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all occupied beds
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
                whereClause.hospitalId = hospitalId;
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch occupied beds based on the filter criteria
        const beds = await prisma.bed.findMany({
            where: whereClause,
            include: {
                hospital: {
                    select: {
                        hospitalName: true,
                        hospitalId: true,
                    },
                },
            },
        });

        return { beds };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching occupied beds:", errorMessage);
        return { beds: [] };
    }
}

/**
 * Fetch count of occupied beds based on user's role and hospitalId.
 */
export async function fetchOccupiedBedsCount(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<number> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return 0;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = { availability: "Occupied" };

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all occupied beds
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
                whereClause.hospitalId = hospitalId;
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Count occupied beds based on the filter criteria
        const occupiedBedsCount = await prisma.bed.count({
            where: whereClause,
        });

        return occupiedBedsCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching occupied beds count:", errorMessage);
        return 0;
    }
}

/**
 * Fetch all beds based on user's role and hospitalId.
 */
export async function fetchAllBeds(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<{ beds: Bed[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { beds: [] };
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
                // No filtering for SUPER_ADMIN, see all beds
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
                whereClause.hospitalId = hospitalId;
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch all beds based on the filter criteria
        const beds = await prisma.bed.findMany({
            where: whereClause,
            include: {
                hospital: {
                    select: {
                        hospitalName: true,
                        hospitalId: true,
                    },
                },
            },
        });

        return { beds };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching all beds:", errorMessage);
        return { beds: [] };
    }
}

/**
 * Fetch count of all beds based on user's role and hospitalId.
 */
export async function fetchAllBedsCount(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<{ count: number }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { count: 0 };
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
                // No filtering for SUPER_ADMIN, see all beds
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
                whereClause.hospitalId = hospitalId;
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Count all beds based on the filter criteria
        const count = await prisma.bed.count({
            where: whereClause,
        });

        return { count };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching all beds count:", errorMessage);
        return { count: 0 };
    }
}

/**
 * Update bed capacities.
 */
export const updateBedCapacity = async (
    bedCapacityId: string,
    data: Partial<BedCapacity>
) => {
    try {
        const updatedCapacity = await prisma.bedCapacity.update({
            where: { bedCapacityId },
            data: {
                totalInpatientBeds: data.totalInpatientBeds,
                generalInpatientBeds: data.generalInpatientBeds,
                cots: data.cots,
                maternityBeds: data.maternityBeds,
                emergencyCasualtyBeds: data.emergencyCasualtyBeds,
                intensiveCareUnitBeds: data.intensiveCareUnitBeds,
                highDependencyUnitBeds: data.highDependencyUnitBeds,
                isolationBeds: data.isolationBeds,
                generalSurgicalTheatres: data.generalSurgicalTheatres,
                maternitySurgicalTheatres: data.maternitySurgicalTheatres,
            },
        });
        return updatedCapacity;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: { errorMessage, bedCapacityId, data },
        });
        throw new Error("Failed to update bed capacity");
    }
};
