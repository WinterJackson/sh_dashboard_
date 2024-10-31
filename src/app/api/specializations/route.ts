// /src/app/api/specializations/route.ts

import { NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET() {
    try {
        const specializations = await prisma.specialization.findMany();
        return NextResponse.json(specializations, { status: 200 });
    } catch (error) {
        console.error("Error fetching specializations:", error);
        return NextResponse.json(
            { message: "Error fetching specializations" },
            { status: 500 }
        );
    }
}
