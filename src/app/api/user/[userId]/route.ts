// src/app/api/user/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
const prisma = require("@/lib/prisma")

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;

    try {
        const user = await prisma.user.findUnique({
            where: { userId },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch patient details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}