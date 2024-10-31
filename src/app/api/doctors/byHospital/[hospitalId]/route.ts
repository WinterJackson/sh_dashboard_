// src/app/api/doctors/byHospital/[hospitalId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { hospitalId: string } }
) {
    try {
        const { hospitalId } = params;
        const doctors = await prisma.doctor.findMany({
            where: { hospitalId: parseInt(hospitalId) },
            include: {
                user: {
                    include: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
                hospital: true,
                department: true,
                specialization: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return NextResponse.json(doctors);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
