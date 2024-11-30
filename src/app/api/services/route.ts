// src/app/api/services/route.ts
import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

/**
 * GET: Fetch all services in the database.
 */
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
                                        hospital: { select: { name: true } },
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
        console.error("Error fetching services:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
