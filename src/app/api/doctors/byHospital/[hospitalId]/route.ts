// src/app/api/doctors/byHospital/[hospitalId]/route.ts

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

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
                        sessions: true,
                        superAdmin: true,
                        admin: true,
                        nurse: true,
                        staff: true,
                        hospital: true,
                    },
                },
                hospital: true,
                department: true,
                specialization: {
                    select: {
                        name: true,
                    },
                },
                service: true,
                appointments: {
                    include: {
                        patient: {
                            include: {
                                referrals: true,
                                serviceUsages: true,
                                currentBed: true,
                                hospital: true,
                            },
                        },
                        hospital: true,
                        services: true,
                        payments: true,
                    },
                },
                docEarnings: true,
                referrals: true,
            },
        });

        return NextResponse.json(doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
