// src/app/api/patients/[name]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma")

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
    const { name } = params;

    try {
        const patient = await prisma.patient.findUnique({
            where: { name },
        });
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        return NextResponse.json(patient, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch patient details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
