// src/app/api/payments/[paymentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { paymentId: string } }
) {
    const token = await getToken({ req });
    if (
        !token ||
        ![Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR].includes(token.role as Role)
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId } = params;

    try {
        const payment = await prisma.payment.findUnique({
            where: { paymentId: parseInt(paymentId) },
        });
        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(payment, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch payment details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Implement POST, PUT, and DELETE similarly
