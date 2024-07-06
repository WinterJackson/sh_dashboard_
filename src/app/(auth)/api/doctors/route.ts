// File: app/api/doctors/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import prisma from "@/lib/prisma";

const prisma = require("@/lib/prisma")

export async function GET(req: NextRequest) {
    try {
        const doctors = await prisma.doctor.findMany();
        return NextResponse.json(doctors);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const {
            userId,
            email,
            hospitalId,
            departmentId,
            serviceId,
            name,
            specialization,
            status,
            contactInformation,
            workingHours
        } = await req.json();

        const newDoctor = await prisma.doctor.create({
            data: {
                userId,
                email,
                hospitalId,
                departmentId,
                serviceId,
                name,
                specialization,
                status,
                contactInformation,
                workingHours
            },
        });

        return NextResponse.json(newDoctor, { status: 201 });
    } catch (error) {
        console.error('Error adding doctor:', error);
        return NextResponse.json({ error: 'Error adding doctor' }, { status: 500 });
    }
}