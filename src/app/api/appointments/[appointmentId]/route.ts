// src/app/api/appointments/[appointmentId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
const prisma = require("@/lib/prisma");

export async function PATCH(req: NextRequest, { params }: { params: { appointmentId: string } }) {
    const { appointmentId } = params;

    try {
        const requestBody = await req.json();
        console.log('Received PATCH request for appointmentId:', appointmentId);
        console.log('Request Body:', requestBody);

        const {
            date,
            timeFrom,
            timeTo,
            doctor,
            hospital,
            type,
            status
        } = requestBody;

        const updateData: any = {};

        if (status) {
            updateData.status = status;
        } else {
            if (!date || !timeFrom || !timeTo || !doctor || !hospital || !type) {
                console.error('Missing fields in the request body');
                return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
            }

            const doctorRecord = await prisma.doctor.findFirst({
                where: {
                    name: doctor,
                },
            });
            if (!doctorRecord) {
                console.error('Doctor not found:', doctor);
                return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
            }
            const doctorId = doctorRecord.doctorId;

            const hospitalRecord = await prisma.hospital.findFirst({
                where: {
                    name: hospital,
                },
            });
            if (!hospitalRecord) {
                console.error('Hospital not found:', hospital);
                return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
            }
            const hospitalId = hospitalRecord.hospitalId;

            const appointmentDate = new Date(date);
            const [hoursFrom, minutesFrom] = timeFrom.split(':');
            appointmentDate.setHours(parseInt(hoursFrom), parseInt(minutesFrom));

            const appointmentEndAt = new Date(date);
            const [hoursTo, minutesTo] = timeTo.split(':');
            appointmentEndAt.setHours(parseInt(hoursTo), parseInt(minutesTo));

            updateData.appointmentDate = appointmentDate;
            updateData.appointmentEndAt = appointmentEndAt;
            updateData.doctorId = doctorId;
            updateData.hospitalId = hospitalId;
            updateData.type = type;
            updateData.status = 'Rescheduled';
        }

        console.log('Updating appointment with data:', updateData);

        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId },
            data: updateData,
        });

        console.log('Appointment updated successfully:', updatedAppointment);

        revalidatePath("/dashboard/appointments");
        return NextResponse.json(updatedAppointment, { status: 200 });
    } catch (error) {
        console.error('Error updating appointment:', error);
        return NextResponse.json({ error: 'Error updating appointment' }, { status: 500 });
    }
}
