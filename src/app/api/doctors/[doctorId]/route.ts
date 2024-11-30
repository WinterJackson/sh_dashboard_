// File: src/app/api/doctors/[doctorId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { doctorId: string } }
) {
    const { doctorId } = params;

    try {
        // Fetch the doctor's details, including associated hospital, user, and specialization
        const doctor = await prisma.doctor.findUnique({
            where: { doctorId: parseInt(doctorId) },
            include: {
                hospital: true,
                user: true,
                specialization: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!doctor) {
            return NextResponse.json(
                { error: "Doctor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(doctor, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch doctor details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
