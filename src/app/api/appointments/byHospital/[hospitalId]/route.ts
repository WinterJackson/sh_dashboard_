// src/app/api/appointments/byHospital/[hospitalId]/route.ts

import { NextRequest, NextResponse } from "next/server";
const prisma = require("@/lib/prisma")

export async function GET(
    req: NextRequest,
    { params }: { params: { hospitalId: string } }
) {
    try {
        const hospitalId = parseInt(params.hospitalId, 10);
        const appointments = await prisma.appointment.findMany({
            where: {
                hospitalId: hospitalId,
            },
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

        // console.log(appointments);
        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
