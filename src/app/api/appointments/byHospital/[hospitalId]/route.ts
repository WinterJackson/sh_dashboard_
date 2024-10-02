// src/app/api/appointments/byHospital/[hospitalId]/route.ts

import { NextRequest, NextResponse } from "next/server";
const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { hospitalId: string } }
) {
    try {
        const hospitalId = parseInt(params.hospitalId, 10);
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "15");
        const skip = (page - 1) * limit;

        const totalAppointments = await prisma.appointment.count({
            where: { hospitalId },
        });

        const appointments = await prisma.appointment.findMany({
            where: { hospitalId },
            skip,
            take: limit,
            include: {
                doctor: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                hospital: true,
                patient: true,
                services: true,
                payments: true,
            },
        });

        return NextResponse.json({ appointments, totalAppointments });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
