// src/app/api/services/route.ts

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const services = await prisma.service.findMany({
            select: {
                serviceId: true,
                serviceName: true,
                departments: {
                    select: {
                        departmentId: true,
                        department: {
                            select: {
                                name: true,
                                hospitals: {
                                    select: {
                                        hospitalId: true,
                                        hospital: {
                                            select: {
                                                hospitalName: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(services, { status: 200 });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching services:", error);
        return NextResponse.json(
            { error: "Failed to fetch services" },
            { status: 500 }
        );
    }
}
