// src/app/api/departments/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET(request: NextRequest) {
    try {
        // Fetch all departments including linked hospitals
        const departments = await prisma.department.findMany({
            select: {
                departmentId: true,
                name: true,
                hospitals: {
                    select: {
                        hospitalId: true,
                        hospital: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(departments);

    } catch (error) {
        console.error("Error fetching departments:", error);
        return new NextResponse("Error fetching departments", { status: 500 });
    }
}
