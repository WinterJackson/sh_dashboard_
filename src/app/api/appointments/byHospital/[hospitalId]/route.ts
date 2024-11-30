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

        // Pagination setup
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "15", 10);
        const skip = (page - 1) * limit;

        // Fetch total appointments count for pagination
        const totalAppointments = await prisma.appointment.count({
            where: { hospitalId },
        });

        // Fetch appointments with associated data
        const appointments = await prisma.appointment.findMany({
            where: { hospitalId },
            skip,
            take: limit,
            include: {
                doctor: {
                    include: {
                        user: {
                            include: { profile: true },
                        },
                    },
                },
                hospital: true,
                patient: true,
                services: true,
                payments: true,
            },
        });

        // Return the paginated response
        return NextResponse.json({ appointments, totalAppointments, page, limit });
    } catch (error) {
        console.error("Error fetching appointments by hospital:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
