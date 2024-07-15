// src/app/api/patients/today/route.ts

import { NextRequest, NextResponse } from 'next/server';
const prisma = require("@/lib/prisma");

export async function GET(req: NextRequest) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const patients = await prisma.appointment.findMany({
            where: {
                appointmentDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            select: {
                patientId: true,
            },
        });

        const uniquePatients = new Set(patients.map((p: { patientId: any; }) => p.patientId));

        return NextResponse.json({ count: uniquePatients.size }, { status: 200 });
    } catch (error) {
        console.error("Error fetching today's patients:", error);
        return NextResponse.json({ error: 'Error fetching today\'s patients' }, { status: 500 });
    }
}