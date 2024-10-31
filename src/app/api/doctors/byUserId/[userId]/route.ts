// src/app/api/doctors/byUserId/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { userId?: string } }
) {

    if (!params?.userId) {
        return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
        );
    }

    console.log(params)

    const { userId } = params;

    try {
        const doctor = await prisma.doctor.findUnique({
            where: { userId },
            include: {
                user: true,
                hospital: true,
                department: true,
                specialization: true,
                appointments: true,
                docEarnings: true,
                referrals: true,
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
        console.error("Error fetching doctor:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
