// src/app/api/appointments/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const prisma = require("@/lib/prisma");

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Role and hospitalId
        const role = searchParams.get('role') || '';
        const hospitalIdString = searchParams.get('hospitalId');
        const hospitalId = hospitalIdString ? parseInt(hospitalIdString, 10) : null;

        // Page and pageSize default values
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '15', 10);

        // Role-specific filtering logic
        const whereClause = role !== 'SUPER_ADMIN' && hospitalId ? { hospitalId } : {};

        // Prisma queries
        const [totalAppointments, appointments] = await Promise.all([
            prisma.appointment.count({ where: whereClause }),
            prisma.appointment.findMany({
                where: whereClause,
                include: {
                    patient: { select: { name: true, patientId: true, dateOfBirth: true } },
                    doctor: {
                        select: { user: { select: { profile: { select: { firstName: true, lastName: true } } } } },
                    },
                    hospital: { select: { name: true, hospitalId: true } },
                },
                orderBy: {
                    appointmentDate: 'desc',
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);

        // Return paginated response
        return NextResponse.json({ appointments, totalAppointments, page, pageSize });
    } catch (error) {
        console.error('Error fetching appointments:', error);
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
            userHospitalId,
        } = await req.json();

        // Validate that the necessary fields are present
        if (!patientName || !patientId || !doctorId || !date || !timeFrom || !timeTo) {
            console.error('Missing required fields:', { patientName, patientId, doctorId, date, timeFrom, timeTo });
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        let hospitalId = userHospitalId;

        if (!hospitalId && hospitalName) {
            // Fetch hospitalId using hospitalName if not found in user session (for SUPER_ADMIN)
            const hospital = await prisma.hospital.findUnique({
                where: { name: hospitalName },
            });

            if (!hospital) {
                console.error('Hospital not found:', hospitalName);
                return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
            }

            hospitalId = hospital.hospitalId;
        }

        // Ensure hospitalId is present
        if (!hospitalId) {
            console.error('Hospital ID is missing:', { hospitalId });
            return NextResponse.json({ error: 'Hospital ID is missing' }, { status: 400 });
        }

        const parsedDoctorId = parseInt(doctorId, 10);
        const parsedPatientId = parseInt(patientId, 10);

        // Validate the appointment date and time
        const appointmentDate = new Date(date);
        if (isNaN(appointmentDate.getTime())) {
            console.error('Invalid date format:', date);
            return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
        }

        const [hoursFrom, minutesFrom] = timeFrom.split(':');
        appointmentDate.setHours(parseInt(hoursFrom, 10), parseInt(minutesFrom, 10));

        const appointmentEndAt = new Date(date);
        const [hoursTo, minutesTo] = timeTo.split(':');
        appointmentEndAt.setHours(parseInt(hoursTo, 10), parseInt(minutesTo, 10));

        // Ensure time is correctly parsed
        if (isNaN(appointmentDate.getTime()) || isNaN(appointmentEndAt.getTime())) {
            console.error('Invalid time format:', { timeFrom, timeTo });
            return NextResponse.json({ error: 'Invalid time format' }, { status: 400 });
        }

        // Create the new appointment
        const newAppointment = await prisma.appointment.create({
            data: {
                patientId: parsedPatientId,
                doctorId: parsedDoctorId,
                hospitalId: parseInt(hospitalId, 10),
                appointmentDate,
                appointmentEndAt,
                type,
                status: 'Pending',
                consultationFee: 100.00,
                isPaid: false,
                completed: false,
                isVideoStarted: false,
                appointmentReminderSent: 0,
            },
        });

        // Revalidate the path after successful creation
        revalidatePath("/dashboard/appointments");
        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        console.error('Error creating appointment:', error);
        return NextResponse.json({ error: 'Error creating appointment' }, { status: 500 });
    }
}