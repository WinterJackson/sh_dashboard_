// src/app/api/messaging/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { edgeStoreRouter } from "@/lib/edgestore-server";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    try {
        const res = await edgeStoreRouter.publicFiles.upload({ file });

        return NextResponse.json({ url: res.url });
    } catch (error) {
        console.error("File upload error:", error);
        return NextResponse.json({ error: "File upload failed" }, { status: 500 });
    }
}
