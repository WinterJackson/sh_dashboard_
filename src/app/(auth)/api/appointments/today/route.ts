// src/app/api/appointments/today/route.ts

import { NextRequest, NextResponse } from 'next/server';
const prisma = require("@/lib/prisma");

export async function GET(req: NextRequest) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const count = await prisma.appointment.count({
            where: {
                appointmentDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        return NextResponse.json({ count }, { status: 200 });
    } catch (error) {
        console.error("Error fetching today's appointments:", error);
        return NextResponse.json({ error: 'Error fetching today\'s appointments' }, { status: 500 });
    }
}
