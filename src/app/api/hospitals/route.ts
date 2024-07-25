// File: app/api/hospitals/route.ts

import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

const prisma = require("@/lib/prisma");

export async function GET(req: NextRequest) {
    try {
        const hospitals = await prisma.hospital.findMany();
        return NextResponse.json(hospitals);
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
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
        console.error("Error adding hospital:", error);
        return NextResponse.json(
            { error: "Error adding hospital" },
            { status: 500 }
        );
    }
}
