// src/app/api/appointments/lastfortnight/route.ts

import { NextRequest, NextResponse } from 'next/server';
const prisma = require("@/lib/prisma");

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
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Include today
                },
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

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error fetching appointments for the last 14 days:", error);
        return NextResponse.json({ error: 'Error fetching appointments for the last 14 days' }, { status: 500 });
    }
}
