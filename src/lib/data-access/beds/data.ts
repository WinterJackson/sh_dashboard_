// File: src/lib/data-access/beds/data.ts

"use server";

import { Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");

/**
 * Fetch available beds based on user's role and hospitalId.
 */
export async function fetchAvailableBeds() {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users
    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const { role, hospitalId } = session?.user || {};

    try {
        if (role === "SUPER_ADMIN") {
            // Fetch all available beds for SUPER_ADMIN
            return await prisma.bed.findMany({
                where: { availability: "Available" },
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId) {
            // Fetch available beds for other roles based on hospitalId
            return await prisma.bed.findMany({
                where: {
                    availability: "Available",
                    hospitalId: hospitalId,
                },
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        // If role or hospitalId is invalid, return empty array
        return [];
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching available beds:", error);
        throw new Error("Failed to fetch available beds.");
    }
}

/**
 * Fetch count of available beds based on user's role and hospitalId.
 */
export async function fetchAvailableBedsCount(role: Role, hospitalId: number | null) {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users
    if (!session || !session.user) {
        redirect("/sign-in");
    }

    try {
        if (role === "SUPER_ADMIN") {
            // Count all available beds for SUPER_ADMIN
            return await prisma.bed.count({
                where: { availability: "Available" },
            });
        } else if (hospitalId) {
            // Count available beds for other roles based on hospitalId
            return await prisma.bed.count({
                where: {
                    availability: "Available",
                    hospitalId: hospitalId,
                },
            });
        }

        // If role or hospitalId is invalid, return 0
        return 0;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching available beds count:", error);
        throw new Error("Failed to fetch available beds count.");
    }
}

/**
 * Fetch occupied beds based on user's role and hospitalId.
 */
export async function fetchOccupiedBeds() {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users
    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const { role, hospitalId } = session?.user || {};

    try {
        if (role === "SUPER_ADMIN") {
            // Fetch all Occupied beds for SUPER_ADMIN
            return await prisma.bed.findMany({
                where: { availability: "Occupied" },
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId) {
            // Fetch Occupied beds for other roles based on hospitalId
            return await prisma.bed.findMany({
                where: {
                    availability: "Occupied",
                    hospitalId: hospitalId,
                },
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        // If role or hospitalId is invalid, return empty array
        return [];
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching occupied beds:", error);
        throw new Error("Failed to fetch occupied beds.");
    }
}

/**
 * Fetch count of occupied beds based on user's role and hospitalId.
 */
export async function fetchOccupiedBedsCount() {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users
    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const { role, hospitalId } = session?.user || {};

    try {
        if (role === "SUPER_ADMIN") {
            // Count all occupied beds for SUPER_ADMIN
            return await prisma.bed.count({
                where: { availability: "Occupied" },
            });
        } else if (hospitalId) {
            // Count occupied beds for other roles based on hospitalId
            return await prisma.bed.count({
                where: {
                    availability: "Occupied",
                    hospitalId: hospitalId,
                },
            });
        }

        // If role or hospitalId is invalid, return 0
        return 0;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching occupied beds count:", error);
        throw new Error("Failed to fetch occupied beds count.");
    }
}

/**
 * Fetch all beds based on user's role and hospitalId.
 */
export async function fetchAllBeds() {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users
    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const { role, hospitalId } = session?.user || {};

    try {
        if (role === "SUPER_ADMIN") {
            // Fetch all beds for SUPER_ADMIN
            return await prisma.bed.findMany({
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId) {
            // Fetch all beds for other roles based on hospitalId
            return await prisma.bed.findMany({
                where: {
                    hospitalId: hospitalId,
                },
                include: {
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        // If role or hospitalId is invalid, return empty array
        return [];
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching all beds:", error);
        throw new Error("Failed to fetch all beds.");
    }
}

/**
 * Fetch count of all beds based on user's role and hospitalId.
 */
export async function fetchAllBedsCount() {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users
    if (!session || !session?.user) {
        redirect("/sign-in");
    }

    const { role, hospitalId } = session?.user || {};

    try {
        if (role === "SUPER_ADMIN") {
            // Count all beds for SUPER_ADMIN
            return await prisma.bed.count();
        } else if (hospitalId) {
            // Count all beds for other roles based on hospitalId
            return await prisma.bed.count({
                where: {
                    hospitalId: hospitalId,
                },
            });
        }

        // If role or hospitalId is invalid, return 0
        return 0;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching occupied beds count:", error);
        throw new Error("Failed to fetch occupied beds count.");
    }
}