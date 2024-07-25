// src/app/api/referrals/[referralId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { referralId: string } }
) {
    const token = await getToken({ req });
    if (
        !token ||
        ![Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE].includes(
            token.role as Role
        )
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { referralId } = params;

    try {
        const referral = await prisma.referral.findUnique({
            where: { referralId: parseInt(referralId) },
        });
        if (!referral) {
            return NextResponse.json(
                { error: "Referral not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(referral, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch referral details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Implement POST, PUT, and DELETE similarly
