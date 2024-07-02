// src/pages/api/patients/[name]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma")

export async function getPatientByName(name: string) {
    try {
        const patient = await prisma.patient.findUnique({
            where: { name },
        });
        return patient;
    } catch (error) {
        console.error("Failed to get patient by name:", error);
        throw new Error("Failed to get patient by name");
    }
}

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
    const { name } = params;

    try {
        const patient = await getPatientByName(name as string);
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        return NextResponse.json(patient, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch patient details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
