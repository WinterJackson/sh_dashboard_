// src/app/api/appointments/[appointmentId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
const prisma = require("@/lib/prisma");

export async function PATCH(req: NextRequest, { params }: { params: { appointmentId: string } }) {
    const { appointmentId } = params;

    try {
        const { status, rescheduledDate, cancellationReason } = await req.json();

        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId },
            data: {
                status,
                rescheduledDate: rescheduledDate ? new Date(rescheduledDate) : undefined,
                cancellationReason
            }
        });

        return NextResponse.json(updatedAppointment, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error updating appointment' }, { status: 500 });
    }
}
