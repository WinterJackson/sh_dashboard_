// src/app/api/messaging/messages/search/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");
    const query = searchParams.get("query");

    if (!conversationId || !query) {
        return NextResponse.json({ error: "conversationId and query are required" }, { status: 400 });
    }

    try {
        const messages = await prisma.message.findMany({
            where: {
                conversationId,
                content: {
                    contains: query,
                    mode: "insensitive",
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(messages);
    } catch (error) {
        Sentry.captureException(error);
        return NextResponse.json({ error: "Failed to search messages" }, { status: 500 });
    }
}