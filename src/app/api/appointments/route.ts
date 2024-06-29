// src/app/api/appointments/route.ts

import { NextRequest, NextResponse } from 'next/server';
const prisma = require("@/lib/prisma");

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '5');
        const skip = (page - 1) * limit;

        const appointments = await prisma.appointment.findMany({
            skip,
            take: limit,
            include: {
                patient: true,
                doctor: true,
            },
        });

        const totalAppointments = await prisma.appointment.count();

        return NextResponse.json({ appointments, totalAppointments }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching appointments' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { patientName, age, patientId, timeFrom, timeTill, date, doctorName, type } = await req.json();

        const newAppointment = await prisma.appointment.create({
            data: {
                patient: {
                    connectOrCreate: {
                        where: { patientId },
                        create: {
                            name: patientName,
                            age: parseInt(age, 10),
                            patientId,
                        },
                    },
                },
                doctor: {
                    connectOrCreate: {
                        where: { name: doctorName },
                        create: { name: doctorName },
                    },
                },
                timeFrom,
                timeTill,
                appointmentDate: new Date(date),
                type,
                status: "Pending",
            },
        });

        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error adding appointment' }, { status: 500 });
    }
}
