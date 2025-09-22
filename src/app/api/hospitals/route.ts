// File: app/api/hospitals/route.ts

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@/lib/definitions";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            );
        }

        const user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id,
        };

        const hospitals = await fetchHospitals(user);
        
        return NextResponse.json(hospitals, { status: 200 });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching hospitals:", error);
        return NextResponse.json(
            { error: "Failed to fetch hospitals" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const newHospital = await prisma.hospital.create({
            data: {
                hospitalName: body.hospitalName,
                hospitalLink: body.hospitalLink,
                phone: body.phone,
                email: body.email,
                county: body.county,
                subCounty: body.subCounty,
                ward: body.ward,
                town: body.town,
                streetAddress: body.streetAddress,
                latitude: body.latitude,
                longitude: body.longitude,
                nearestLandmark: body.nearestLandmark,
                plotNumber: body.plotNumber,
                kephLevel: body.kephLevel,
                regulatoryBody: body.regulatoryBody,
                ownershipType: body.ownershipType,
                facilityType: body.facilityType,
                nhifAccreditation: body.nhifAccreditation,
                open24Hours: body.open24Hours,
                openWeekends: body.openWeekends,
                regulated: body.regulated,
                regulationStatus: body.regulationStatus,
                regulatingBody: body.regulatingBody,
                registrationNumber: body.registrationNumber,
                licenseNumber: body.licenseNumber,
                category: body.category,
                owner: body.owner,
                referralCode: body.referralCode,
                website: body.website,
                logoUrl: body.logoUrl,
                operatingHours: body.operatingHours,
                emergencyPhone: body.emergencyPhone,
                emergencyEmail: body.emergencyEmail,
                description: body.description,
            },
        });

        return NextResponse.json(newHospital, { status: 201 });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error adding hospital:", error);
        if (error instanceof Error && error.message.includes("Unique constraint failed")) {
             return NextResponse.json(
                { error: "A hospital with the same name or referral code already exists." },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: "Failed to add hospital" },
            { status: 500 }
        );
    }
}
