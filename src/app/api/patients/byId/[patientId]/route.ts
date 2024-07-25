// src/app/api/patients/[patientId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { patientId: string } }
) {
    const token = await getToken({ req });
    if (
        !token ||
        ![Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE].includes(
            token.role as Role
        )
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { patientId } = params;

    try {
        const patient = await prisma.patient.findUnique({
            where: { patientId: parseInt(patientId) },
        });
        if (!patient) {
            return NextResponse.json(
                { error: "Patient not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(patient, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch patient details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Implement POST, PUT, and DELETE similarly
