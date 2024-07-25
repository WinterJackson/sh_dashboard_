// src/app/api/staff/[staffId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { staffId: string } }
) {
    const token = await getToken({ req });
    if (
        !token ||
        ![Role.SUPER_ADMIN, Role.ADMIN, Role.STAFF].includes(token.role as Role)
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { staffId } = params;

    try {
        const staff = await prisma.user.findUnique({
            where: { userId: parseInt(staffId) },
            include: { hospital: true },
        });
        if (!staff) {
            return NextResponse.json(
                { error: "Staff not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch staff details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Implement POST, PUT, and DELETE similarly
