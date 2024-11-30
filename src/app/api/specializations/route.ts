// src/app/api/specializations/route.ts

import { NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET() {
    try {
        // Fetch specializations
        const specializations = await prisma.specialization.findMany({
            select: {
                specializationId: true,
                name: true,
            },
        });

        return NextResponse.json(specializations, { status: 200 });
    } catch (error) {
        console.error("Error fetching specializations:", error);
        return NextResponse.json(
            { message: "Error fetching specializations" },
            { status: 500 }
        );
    }
}
