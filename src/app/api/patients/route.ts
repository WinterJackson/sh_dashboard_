// File: app/api/patients/route.ts

import { NextRequest, NextResponse } from 'next/server';
// import prisma from "@/lib/prisma";

const prisma = require("@/lib/prisma")

export async function GET(req: NextRequest) {
    try {
        const patients = await prisma.patient.findMany();
        return NextResponse.json(patients);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}