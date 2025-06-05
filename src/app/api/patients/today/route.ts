// src/app/api/patients/today/route.ts

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

        // Use a Map to track unique patients by their patientId
        const uniquePatientsMap = new Map();

        appointments.forEach((appointment: { patient: { patientId: any; }; }) => {
            const patientId = appointment.patient.patientId;
            if (!uniquePatientsMap.has(patientId)) {
                uniquePatientsMap.set(patientId, appointment.patient);
            }
        });

        // Convert the Map values to an array of unique patients
        const uniquePatients = Array.from(uniquePatientsMap.values());

        // console.log(uniquePatients);

        return NextResponse.json(uniquePatients, { status: 200 });
    } catch (error) {
        console.error("Error fetching today's patients:", error);
        return NextResponse.json({ error: "Error fetching today's patients" }, { status: 500 });
    }
}