// File: app/api/doctors/[doctorId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { doctorId: string } }
) {
    const token = await getToken({ req });
    if (
        !token ||
        ![Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR].includes(token.role as Role)
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { doctorId } = params;

    try {
        const doctor = await prisma.user.findUnique({
            where: { userId: parseInt(doctorId) },
            include: { hospital: true },
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

// Implement POST, PUT, and DELETE similarly
