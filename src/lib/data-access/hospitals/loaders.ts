// src/lib/data-access/hospitals/loaders.ts
"use server";

import { Hospital, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import prisma from "@/lib/prisma";

/**
 * Load hospitals with role-based access control
 */
export async function loadHospitals(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<Hospital[]> {
    try {
        let whereClause: Record<string, any> = {};

        // Anonymous access: fetch all hospitals
        if (!user) {
            return await prisma.hospital.findMany({
                select: {
                    hospitalId: true,
                    hospitalName: true,
                    hospitalLink: true,
                    phone: true,
                    email: true,
                    kephLevel: true,
                    regulatoryBody: true,
                    ownershipType: true,
                    facilityType: true,
                    nhifAccreditation: true,
                    open24Hours: true,
                    openWeekends: true,
                    regulated: true,
                    regulationStatus: true,
                    regulatingBody: true,
                    registrationNumber: true,
                    licenseNumber: true,
                    category: true,
                    owner: true,
                    county: true,
                    subCounty: true,
                    ward: true,
                    latitude: true,
                    longitude: true,
                    town: true,
                    streetAddress: true,
                    referralCode: true,
                    description: true,
                    emergencyPhone: true,
                    emergencyEmail: true,
                    website: true,
                    logoUrl: true,
                    operatingHours: true,
                    nearestLandmark: true,
                    plotNumber: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        }

        // Role-based filtering
        switch (user.role) {
            case "SUPER_ADMIN":
                // Explicitly no filter -> fetch all
                whereClause = {};
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
                hospitalLink: true,
                phone: true,
                email: true,
                kephLevel: true,
                ownershipType: true,
                county: true,
                subCounty: true,
                town: true,
                streetAddress: true,
                referralCode: true,
                createdAt: true,
                updatedAt: true,
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
