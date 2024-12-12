// src/app/api/departments/route.ts

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { fetchDepartments } from "@/lib/data-access/departments/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@/lib/definitions";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {

    const session = await getServerSession(authOptions);

    const user = {
        role: session?.user?.role as Role,
        hospitalId: session?.user?.hospitalId?.toString() || null,
    };

    try {
        const departments = await fetchDepartments(user);
        return NextResponse.json(departments, { status: 200 });
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching departments:", error);
        return NextResponse.json(
            { error: "Failed to fetch departments" },
            { status: 500 }
        );
    }
}
