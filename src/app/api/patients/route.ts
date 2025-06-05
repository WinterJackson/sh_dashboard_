// File: app/api/patients/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const patients = await prisma.patient.findMany({
            include: {
                appointments: true,
            },
        });
        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
export async function POST(req: NextRequest) {
    try {
        const {
            name,
            phoneNo,
            email,
            age,
            gender,
            appointmentReason,
            hospitalId
        } = await req.json();

        const newPatient = await prisma.patient.create({
            data: {
                name,
                phoneNo,
                email,
                age,
                gender,
                appointmentReason,
                hospitalId,
                status: 'Active'
            },
        });

        return NextResponse.json(newPatient, { status: 201 });
    } catch (error) {
        console.error('Error adding patient:', error);
        return NextResponse.json({ error: 'Error adding patient' }, { status: 500 });
    }
}