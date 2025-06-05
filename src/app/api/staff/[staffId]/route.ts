// src/app/api/staff/[staffId]/route.ts

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";

/**
 * GET staff details by staffId.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { staffId: string } }
) {
    const { staffId } = params;

    try {
        // Fetch staff details
        const staff = await prisma.user.findUnique({
            where: { userId: parseInt(staffId) },
            include: { hospital: true },
        });

        // Handle staff not found
        if (!staff) {
            return NextResponse.json(
                { error: "Staff not found" },
                { status: 404 }
            );
        }

        // Return the staff details
        return NextResponse.json(staff, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch staff details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
