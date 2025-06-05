// src/app/api/patients/lastfortnight/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 13);

        const appointments = await prisma.appointment.findMany({
            where: {
                appointmentDate: {
                    gte: fourteenDaysAgo,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
            include: {
                services: true,
                hospital: true,
                payments: true,
                doctor: true,
                patient: true,
            },
        });

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error fetching appointments for the last 14 days:", error);
        return NextResponse.json({ error: 'Error fetching appointments for the last 14 days' }, { status: 500 });
    }
}