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

    if (!token || ![Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF].includes(token.role as Role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { hospitalId } = params;

    try {
        let patients;
        
        if (token.role === Role.SUPER_ADMIN) {
            // Fetch all patients for super admin
            patients = await prisma.patient.findMany({
                include: {
                    hospital: true,
                    appointments: true,
                },
            });
        } else {
            // For other roles, fetch patients by hospitalId
            if (!hospitalId || token.hospitalId !== parseInt(hospitalId)) {
                return NextResponse.json({ error: "Unauthorized access to hospital data" }, { status: 401 });
            }
            
            patients = await prisma.patient.findMany({
                where: { hospitalId: parseInt(hospitalId) },
                include: {
                    hospital: true,
                    appointments: true,
                },
            });
        }

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
