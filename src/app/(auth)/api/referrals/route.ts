// src/app/api/referrals/route.ts

import { NextRequest, NextResponse } from 'next/server';
const prisma = require("@/lib/prisma");

export async function POST(req: NextRequest) {
    try {
        const {
            patientId,
            hospitalName,
            date,
            type
        } = await req.json();

        const hospital = await prisma.hospital.findFirst({
            where: {
                name: hospitalName,
            },
        });
        if (!hospital) {
            return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
        }
        const hospitalId = hospital.hospitalId;

        const referralDate = new Date(date);

        const newReferral = await prisma.referral.create({
            data: {
                patientId,
                hospitalId,
                date: referralDate,
                type,
            },
        });

        return NextResponse.json(newReferral, { status: 201 });
    } catch (error) {
        console.error('Error referring patient:', error);
        return NextResponse.json({ error: 'Error referring patient' }, { status: 500 });
    }
}
