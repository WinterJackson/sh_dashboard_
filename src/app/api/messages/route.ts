// src/app/api/messages/[messageId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Role } from "@/lib/definitions";

import prisma from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: { messageId: string } }
) {
    const token = await getToken({ req });
    if (
        !token ||
        ![
            Role.SUPER_ADMIN,
            Role.ADMIN,
            Role.DOCTOR,
            Role.NURSE,
            Role.STAFF,
        ].includes(token.role as Role)
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { messageId } = params;

    try {
        const message = await prisma.message.findUnique({
            where: { messageId: parseInt(messageId) },
        });
        if (!message) {
            return NextResponse.json(
                { error: "Message not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(message, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch message details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// Implement POST, PUT, and DELETE similarly
