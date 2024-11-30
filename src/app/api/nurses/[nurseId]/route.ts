// File: app/api/nurses/[nurseId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { nurseId: string } }
) {
    const { nurseId } = params;

    try {
        const nurse = await prisma.user.findUnique({
            where: { userId: parseInt(nurseId) },
            include: { hospital: true },
        });

        if (!nurse) {
            return NextResponse.json(
                { error: "Nurse not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(nurse, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch nurse details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
