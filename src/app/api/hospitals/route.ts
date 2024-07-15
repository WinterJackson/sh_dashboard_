// File: app/api/hospitals/route.ts

import { NextRequest, NextResponse } from 'next/server';
// import prisma from "@/lib/prisma";

const prisma = require("@/lib/prisma")

export async function GET(req: NextRequest) {
    try {
        const hospitals = await prisma.hospital.findMany();
        return NextResponse.json(hospitals);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}