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