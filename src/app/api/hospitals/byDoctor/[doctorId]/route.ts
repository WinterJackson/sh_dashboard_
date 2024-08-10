// src/app/api/hospitals/byDoctor/[doctorId]/route.ts

import { NextRequest, NextResponse } from "next/server";
const prisma = require("@/lib/prisma")

export async function GET(req: NextRequest, { params }: { params: { doctorId: string } }) {
    try {
        const { doctorId } = params;
        const hospitals = await prisma.hospital.findUnique({
            where: {
                doctorId: parseInt(doctorId),
            },
        });
        return NextResponse.json(hospitals);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
