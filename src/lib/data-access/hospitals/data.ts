// src/lib/data-access/hospitals/data.ts

"use server";

import { Hospital, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");


/**
 * Fetches a list of hospitals.
 */
export async function fetchHospitals(
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Hospital[]> {
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
            userId: session.user.id ?? null,
        };
    }

    try {
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (user.role) {
            case "SUPER_ADMIN":
                // SUPER_ADMIN can see all hospitals without filtering
                break;

            case "ADMIN":
                if (user.hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                // Admins see only their associated hospital
                whereClause = { hospitalId: user.hospitalId };
                break;

            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (user.hospitalId === null) {
                    throw new Error(`${user.role}s must have an associated hospital ID.`);
                }
                // Staff members see only their associated hospital
                whereClause = { hospitalId: user.hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch hospitals based on the filter criteria
        const hospitals = await prisma.hospital.findMany({
            where: whereClause,
            select: {
                hospitalId: true,
                hospitalName: true,
                phone: true,
                email: true,
                county: true,
                subCounty: true,
                town: true,
                streetAddress: true,
            },
        });

        if (!hospitals.length) {
            console.warn("No hospitals found in the database.");
        }

        return hospitals;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching hospitals:", errorMessage);
        return [];
    }
}