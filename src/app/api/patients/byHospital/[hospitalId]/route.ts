// src/app/api/patients/byHospital/[hospitalId]/route.ts

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { hospitalId: string } }
) {
    const { hospitalId } = params;

    try {
        // Fetch patients associated with the hospital
        const patients = await prisma.patient.findMany({
            where: { hospitalId: parseInt(hospitalId) },
            include: {
                hospital: true,
                appointments: true,
            },
        });

        if (patients.length === 0) {
            return NextResponse.json(
                { error: "No patients found for the specified hospital" },
                { status: 404 }
            );
        }

        return NextResponse.json(patients, { status: 200 });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}