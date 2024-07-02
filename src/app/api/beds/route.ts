// File: app/api/beds/route.ts
import { NextRequest, NextResponse } from 'next/server';
// import prisma from "@/lib/prisma";

const prisma = require("@/lib/prisma")

export async function GET(req: NextRequest) {
    try {
        const beds = await prisma.bed.findMany();
        return NextResponse.json(beds);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}