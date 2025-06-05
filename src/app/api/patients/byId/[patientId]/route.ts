// src/app/api/patients/[patientId]/route.ts

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

/**
 * Fetches details of a specific patient.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { patientId: string } }
) {
    const { patientId } = params;

    try {
        // Fetch patient details from the database
        const patient = await prisma.patient.findUnique({
            where: { patientId: parseInt(patientId, 10) },
        });

        // Handle patient not found
        if (!patient) {
            return NextResponse.json(
                { error: "Patient not found" },
                { status: 404 }
            );
        }

        // Return patient details
        return NextResponse.json(patient, { status: 200 });
    } catch (error) {
        console.error("Error fetching patient details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}