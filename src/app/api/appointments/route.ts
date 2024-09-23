// src/app/api/appointments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const prisma = require("@/lib/prisma");

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '15');
        const skip = (page - 1) * limit;

        const appointments = await prisma.appointment.findMany({
            skip,
            take: limit,
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
                patient: true,
                hospital: true,
                services: true,
                payments: true,
            },
        });

        // console.log(appointments)

        return NextResponse.json(appointments);
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
            doctorId,
            type,
            hospitalName,
            role,
            userHospitalId,
        } = await req.json();

        if (!patientName || !patientId) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        let hospitalId;

        if (role === 'SUPER_ADMIN') {
            // Fetch hospitalId using hospitalName
            const hospital = await prisma.hospital.findUnique({
                where: { name: hospitalName },
            });

            if (!hospital) {
                return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
            }

            hospitalId = hospital.hospitalId;
        } else {
            // hospitalId from user context
            hospitalId = userHospitalId;
        }

        const parsedDoctorId = parseInt(doctorId, 10); // Parse doctorId as integer
        const parsedPatientId = parseInt(patientId, 10); // Parse patientId as integer

        const appointmentDate = new Date(date);
        const [hoursFrom, minutesFrom] = timeFrom.split(':');
        appointmentDate.setHours(parseInt(hoursFrom), parseInt(minutesFrom));

        const appointmentEndAt = new Date(date);
        const [hoursTo, minutesTo] = timeTo.split(':');
        appointmentEndAt.setHours(parseInt(hoursTo), parseInt(minutesTo));

        const newAppointment = await prisma.appointment.create({
            data: {
                patientId: parsedPatientId,
                doctorId: parsedDoctorId,
                hospitalId: parseInt(hospitalId, 10),
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