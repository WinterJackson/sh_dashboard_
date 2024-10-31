// src/app/api/patients/byHospital/[hospitalId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { hospitalId: string } }
) {
    const token = await getToken({ req });

    if (
        !token ||
        ![Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF].includes(
            token.role as Role
        )
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hospitalId } = params;

    try {
        // Fetch patients where hospitalId matches
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
        console.error("Failed to fetch patients by hospital:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
