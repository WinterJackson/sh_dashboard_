// File: app/api/nurses/[nurseId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { nurseId: string } }
) {
    const token = await getToken({ req });
    if (
        !token ||
        ![Role.SUPER_ADMIN, Role.ADMIN, Role.NURSE].includes(token.role as Role)
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

// Implement POST, PUT, and DELETE similarly
