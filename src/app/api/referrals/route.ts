// src/app/api/referrals/route.ts

import { NextRequest, NextResponse } from "next/server";
const prisma = require("@/lib/prisma");

export async function POST(req: NextRequest) {
    try {
        const {
            patientId,
            patientName,
            gender,
            dateOfBirth,
            homeAddress,
            state,
            phoneNo,
            email,
            physicianName,
            physicianDepartment,
            physicianSpecialty,
            physicianEmail,
            physicianPhoneNumber,
            hospitalName,
            type,
            primaryCareProvider,
            referralAddress,
            referralPhone,
            reasonForConsultation,
            diagnosis,
            status,
        } = await req.json();

        const hospital = await prisma.hospital.findFirst({
            where: {
                name: hospitalName,
            },
        });

        if (!hospital) {
            return NextResponse.json(
                { error: "Hospital not found" },
                { status: 404 }
            );
        }
        const hospitalId = hospital.hospitalId;

        const referralDate = new Date();

        console.log(referralDate);

        const patient = await prisma.patient.upsert({
            where: { patientId },
            update: {
                name: patientName,
                gender,
                dateOfBirth: new Date(dateOfBirth),
                homeAddress,
                state,
                phoneNo,
                email,
                reasonForConsultation,
                status,
            },
            create: {
                patientId,
                name: patientName,
                gender,
                dateOfBirth: new Date(dateOfBirth),
                homeAddress,
                state,
                phoneNo,
                email,
                hospitalId,
                reasonForConsultation,
                status,
            },
        });

        const existingReferral = await prisma.referral.findFirst({
            where: {
                patientId: patient.patientId,
                hospitalId: hospital.hospitalId,
                type,
                date: referralDate
            },
        });

        if (existingReferral) {
            return NextResponse.json(
                { error: "Referral already exists" },
                { status: 400 }
            );
        }

        const newReferral = await prisma.referral.create({
            data: {
                patientId: patient.patientId,
                hospitalId,
                date: referralDate,
                type,
                primaryCareProvider,
                referralAddress,
                referralPhone,
                reasonForConsultation,
                diagnosis,
                physicianName,
                physicianDepartment,
                physicianSpecialty,
                physicianEmail,
                physicianPhoneNumber,
            },
        });

        return NextResponse.json(newReferral, { status: 201 });
    } catch (error) {
        console.error("Error referring patient:", error);
        return NextResponse.json(
            { error: "Error referring patient" },
            { status: 500 }
        );
    }
}
