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
export async function fetchHospitals(): Promise<Hospital[]> {
    
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
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
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching hospitals:", errorMessage);
        return [];
    }
}