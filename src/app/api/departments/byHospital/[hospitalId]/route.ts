// src/app/api/departments/byHospital/[hospitalId]/route.ts

import { NextResponse } from 'next/server';

const prisma = require("@/lib/prisma");

export async function GET(req: Request, { params }: { params: { hospitalId: string } }) {
    const { hospitalId } = params;

    if (!hospitalId) {
        return NextResponse.json({ error: "Hospital ID is required" }, { status: 400 });
    }

    try {
        const departments = await prisma.department.findMany({
            where: {
                hospitals: {
                    some: {
                        hospitalId: parseInt(hospitalId, 10),
                    },
                },
            },
            select: {
                departmentId: true,
                name: true,
            },
        });

        return NextResponse.json(departments);
    } catch (error) {
        console.error("Error fetching departments:", error);
        return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
    }
}
