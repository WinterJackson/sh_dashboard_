// src/app/api/messaging/conversations/[conversationId]/participants/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { Role } from "@/lib/definitions";

export async function POST(
    req: NextRequest,
    { params }: { params: { conversationId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { user } = session;

    const { conversationId } = params;
    const { userId: userIdToAdd } = await req.json();

    if (!userIdToAdd) {
        return NextResponse.json({ error: "User ID to add is required" }, { status: 400 });
    }

    try {
        const conversation = await prisma.conversation.findUnique({
            where: { conversationId },
            include: { participants: true },
        });

        if (!conversation) {
            return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
        }

        const isCurrentUserParticipant = conversation.participants.some((p: { userId: string }) => p.userId === user.id);

        if (!isCurrentUserParticipant && user.role !== Role.SUPER_ADMIN && user.role !== Role.ADMIN) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const isUserAlreadyParticipant = conversation.participants.some((p: { userId: string }) => p.userId === userIdToAdd);

        if (isUserAlreadyParticipant) {
            return NextResponse.json({ error: "User is already a participant" }, { status: 409 });
        }

        const newParticipant = await prisma.conversationParticipant.create({
            data: {
                conversationId,
                userId: userIdToAdd,
            },
        });

        return NextResponse.json(newParticipant, { status: 201 });
    } catch (error) {
        console.error("Error adding participant:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
