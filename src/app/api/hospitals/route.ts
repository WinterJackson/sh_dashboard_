// File: app/api/hospitals/route.ts

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@/lib/definitions";

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
        const {
            name,
            phone,
            email,
            country,
            city,
            referralCode,
            website,
            logoUrl,
        } = await req.json();

        const newHospital = await prisma.hospital.create({
            data: {
                name,
                phone,
                email,
                country,
                city,
                referralCode,
                website,
                logoUrl,
            },
        });

        return NextResponse.json(newHospital, { status: 201 });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error adding hospital:", error);
        return NextResponse.json(
            { error: "Failed to add hospital" },
            { status: 500 }
        );
    }
}
