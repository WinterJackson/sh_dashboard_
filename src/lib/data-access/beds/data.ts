// File: src/lib/data-access/beds/data.ts

"use server";

import { Bed, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

/**
 * Fetch available beds based on user's role and hospitalId.
 */
export async function fetchAvailableBeds(
    user?: { role: Role; hospitalId: number | null }
): Promise<{ beds: Bed[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { beds: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        let beds = [];
        if (role === "SUPER_ADMIN") {
            beds = await prisma.bed.findMany({
                where: { availability: "Available" },
                include: { hospital: { select: { name: true, hospitalId: true } } },
            });
        } else if (hospitalId) {
            beds = await prisma.bed.findMany({
                where: { availability: "Available", hospitalId },
                include: { hospital: { select: { name: true, hospitalId: true } } },
            });
        }

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
export async function fetchAvailableBedsCount(
    user?: { role: Role; hospitalId: number | null }
): Promise<number> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return 0;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        let availableBedsCount = 0;
        if (role === "SUPER_ADMIN") {
            // Count all available beds for SUPER_ADMIN
            availableBedsCount = await prisma.bed.count({
                where: { availability: "Available" },
            });
        } else if (hospitalId) {
            // Count available beds for other roles based on hospitalId
            availableBedsCount = await prisma.bed.count({
                where: {
                    availability: "Available",
                    hospitalId: hospitalId,
                },
            });
        }

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
export async function fetchOccupiedBeds(
    user?: { role: Role; hospitalId: number | null }
): Promise<{ beds: Bed[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { beds: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        let beds = [];
        if (role === "SUPER_ADMIN") {
            // Fetch all occupied beds for SUPER_ADMIN
            beds = await prisma.bed.findMany({
                where: { availability: "Occupied" },
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId) {
            // Fetch occupied beds for other roles based on hospitalId
            beds = await prisma.bed.findMany({
                where: {
                    availability: "Occupied",
                    hospitalId: hospitalId,
                },
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

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
export async function fetchOccupiedBedsCount(
    user?: { role: Role; hospitalId: number | null }
): Promise<number> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return 0;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        let occupiedBedsCount = 0;
        if (role === "SUPER_ADMIN") {
            // Count all occupied beds for SUPER_ADMIN
            occupiedBedsCount = await prisma.bed.count({
                where: { availability: "Occupied" },
            });
        } else if (hospitalId) {
            // Count occupied beds for other roles based on hospitalId
            occupiedBedsCount = await prisma.bed.count({
                where: {
                    availability: "Occupied",
                    hospitalId: hospitalId,
                },
            });
        }

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
export async function fetchAllBeds(
    user?: { role: Role; hospitalId: number | null }
): Promise<{ beds: Bed[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { beds: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        let beds = [];
        if (role === "SUPER_ADMIN") {
            // Fetch all beds for SUPER_ADMIN
            beds = await prisma.bed.findMany({
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId) {
            // Fetch all beds for other roles based on hospitalId
            beds = await prisma.bed.findMany({
                where: {
                    hospitalId: hospitalId,
                },
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

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
export async function fetchAllBedsCount(
    user?: { role: Role; hospitalId: number | null }
): Promise<{ count: number }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { count: 0 };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        let count = 0;

        if (role === "SUPER_ADMIN") {
            // Count all beds for SUPER_ADMIN
            count = await prisma.bed.count();
        } else if (hospitalId) {
            // Count all beds for other roles based on hospitalId
            count = await prisma.bed.count({
                where: {
                    hospitalId: hospitalId,
                },
            });
        }

        return { count };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching all beds count:", errorMessage);
        return { count: 0 };
    }
}