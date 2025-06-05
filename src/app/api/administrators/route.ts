// File: app/api/administrators/[adminId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { adminId: string } }
) {
    const token = await getToken({ req });
    if (!token || token.role !== Role.SUPER_ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adminId } = params;

    try {
        const admin = await prisma.user.findUnique({
            where: { userId: parseInt(adminId) },
            include: { hospital: true },
        });
        if (!admin) {
            return NextResponse.json(
                { error: "Administrator not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(admin, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch administrator details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Implement POST, PUT, and DELETE similarly
