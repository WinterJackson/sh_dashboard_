// src/lib/data-access/hospitals/data.ts

"use server";

import { Hospital, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");


/**
 * Fetches a list of hospitals.
 */
export async function fetchHospitals() {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }
    
    try {
        const hospitals = await prisma.hospital.findMany({
            select: {
                hospitalId: true,
                name: true,
                phone: true,
                email: true,
                country: true,
                city: true,
            },
        });

        if (!hospitals.length) {
            console.warn("No hospitals found in the database.");
        }

        return hospitals;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching hospitals:", error);
        throw new Error("Failed to fetch hospitals.");
    }
}