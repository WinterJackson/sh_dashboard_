// This API route is deprecated. Conversation fetching is now handled by the `fetchConversations` server action.

import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ error: "This endpoint is deprecated." }, { status: 410 });
}
