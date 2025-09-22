// src/app/api/messaging/messages/[conversationId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { fetchMessages } from "@/lib/data-access/messaging/data";
import * as Sentry from "@sentry/nextjs";

export async function GET(
    req: NextRequest,
    { params }: { params: { conversationId: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);

    try {
        const messages = await fetchMessages(conversationId, page);
        return NextResponse.json(messages);
    } catch (error) {
        Sentry.captureException(error);
        return NextResponse.json(
            { error: "Failed to fetch messages" },
            { status: 500 }
        );
    }
}
