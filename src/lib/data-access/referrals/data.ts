// src/lib/data-access/referrals/data.ts

"use server";

import { Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");


export const fetchInwardReferrals = async (role: string, hospitalId: number | null) => {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }
    
    try {
        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all internal referrals for SUPER_ADMIN
            return await prisma.referral.findMany({
                where: {
                    type: "Internal",
                },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.findMany({
                where: {
                    type: "Internal",
                    hospitalId: hospitalId,
                },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        // Return empty array if role or hospitalId is invalid
        return [];
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching inward referrals:", error);

        throw new Error("Failed to fetch inward referrals.");
    }
};

export const fetchInwardReferralsCount = async (role: string, hospitalId: number | null) => {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }
    
    try {
        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all internal referrals for SUPER_ADMIN
            return await prisma.referral.count({
                where: {
                    type: "Internal",
                }
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.count({
                where: {
                    type: "Internal",
                    hospitalId: hospitalId,
                }
            });
        }

        // Return zero if role or hospitalId is invalid
        return 0;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching inward referrals count:", error);

        throw new Error("Failed to fetch inward referrals count.");
    }
};

export const fetchOutwardReferrals = async (role: string, hospitalId: number | null) => {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }
    
    try {
        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all external referrals for SUPER_ADMIN
            return await prisma.referral.findMany({
                where: {
                    type: "External",
                },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.findMany({
                where: {
                    type: "External",
                    hospitalId: hospitalId,
                },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        // Return empty array if role or hospitalId is invalid
        return [];
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching outward referrals:", error);

        throw new Error("Failed to fetch outward referrals.");
    }
};

export const fetchOutwardReferralsCount = async (role: string, hospitalId: number | null) => {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }
    
    try {
        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all external referrals for SUPER_ADMIN
            return await prisma.referral.count({
                where: {
                    type: "External",
                }
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.count({
                where: {
                    type: "External",
                    hospitalId: hospitalId,
                }
            });
        }

        // Return zero if role or hospitalId is invalid
        return 0;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching outward referrals count:", error);

        throw new Error("Failed to fetch outward referrals count.");
    }
};
