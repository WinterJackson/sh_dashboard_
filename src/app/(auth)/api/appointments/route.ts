// src/app/api/appointments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
                hospital: true,
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
        const {
            patientName,
            age,
            patientId,
            timeFrom,
            timeTo,
            date,
            doctorName,
            type,
            hospitalName,
        } = await req.json();

        if (!patientName || !age || !patientId || !timeFrom || !timeTo || !date || !doctorName || !type || !hospitalName) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Fetch doctorId using doctorName
        const doctor = await prisma.doctor.findFirst({
            where: {
                name: doctorName,
            },
        });
        if (!doctor) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }
        const doctorId = doctor.doctorId;

        // Fetch hospitalId using hospitalName
        const hospital = await prisma.hospital.findFirst({
            where: {
                name: hospitalName,
            },
        });
        if (!hospital) {
            return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
        }
        const hospitalId = hospital.hospitalId;

        const appointmentDate = new Date(date);
        const [hoursFrom, minutesFrom] = timeFrom.split(':');
        appointmentDate.setHours(parseInt(hoursFrom), parseInt(minutesFrom));

        const appointmentEndAt = new Date(date);
        const [hoursTo, minutesTo] = timeTo.split(':');
        appointmentEndAt.setHours(parseInt(hoursTo), parseInt(minutesTo));

        const newAppointment = await prisma.appointment.create({
            data: {
                patientId: parseInt(patientId),
                doctorId,
                hospitalId,
                appointmentDate,
                type,
                status: 'Pending',
                consultationFee: 100.00,
                isPaid: false,
                completed: false,
                isVideoStarted: false,
                appointmentEndAt,
                appointmentReminderSent: 0,
                doctorAppointmentNotes: '',
                patientAppointmentNotes: '',
                reasonForVisit: '',
            },
        });

        revalidatePath("/dashboard/appointments");
        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 });
    }
}
