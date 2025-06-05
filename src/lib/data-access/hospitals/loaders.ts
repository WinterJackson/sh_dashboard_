// src/lib/data-access/hospitals/loaders.ts

"use server";

import { Hospital, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";

import prisma from "@/lib/prisma";

export async function loadHospitals(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<Hospital[]> {
    try {
        let whereClause: any = {};

        // Anonymous access: fetch all hospitals
        if (!user) {
            return await prisma.hospital.findMany({
                select: {
                    hospitalId: true,
                    hospitalName: true,
                    phone: true,
                    email: true,
                    county: true,
                    subCounty: true,
                    town: true,
                    streetAddress: true,
                    ownershipType: true,
                    kephLevel: true,
                    referralCode: true,
                },
            });
        }

        switch (user.role) {
            case "SUPER_ADMIN":
                // SUPER_ADMIN can see all hospitals
                break;
            case "ADMIN":
                if (user.hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                whereClause = { hospitalId: user.hospitalId };
                break;
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (user.hospitalId === null) {
                    throw new Error(`${user.role}s must have an associated hospital ID.`);
                }
                whereClause = { hospitalId: user.hospitalId };
                break;
            default:
                throw new Error("Invalid role provided.");
        }

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
                ownershipType: true,
                kephLevel: true,
                referralCode: true,
            },
        });

        if (!hospitals.length) {
            console.warn("No hospitals found in the database.");
        }

        return hospitals || [];
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error loading hospitals:", errorMessage);
        return [];
    }
}
