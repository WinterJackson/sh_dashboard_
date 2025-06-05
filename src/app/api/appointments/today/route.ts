// src/app/api/appointments/today/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const appointments = await prisma.appointment.findMany({
            where: {
                appointmentDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            select: {
                appointmentDate: true,
                hospitalId: true,
            },
        });

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        console.error("Error fetching today's appointments:", error);
        return NextResponse.json({ error: "Error fetching today's appointments" }, { status: 500 });
    }
}
