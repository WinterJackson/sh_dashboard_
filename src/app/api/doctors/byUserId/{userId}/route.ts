// src/app/api/doctors/byUserId/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
const prisma = require("@/lib/prisma");

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId } = params;

        // Find the doctor by userId
        const doctor = await prisma.doctor.findUnique({
            where: {
                userId: userId,  // Match userId directly
            },
            include: {
                user: true,
            },
        });

        if (!doctor) {
            return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
        }

        return NextResponse.json(doctor);
    } catch (error) {
        console.error('Error fetching doctor by userId:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
