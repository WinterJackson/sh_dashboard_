// src/app/api/specializations/route.ts

import { NextResponse } from "next/server";
import { fetchSpecializations } from "@/lib/data-access/specializations/data";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import * as Sentry from "@sentry/nextjs";

export const dynamic = 'force-dynamic';

/**
 * GET: Fetches the list of specializations.
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        const user = session?.user
            ?   {
                    role: session.user.role,
                    hospitalId: session.user.hospitalId,
                }
            : undefined;

        const specializations = await fetchSpecializations(user);        return NextResponse.json(specializations, { status: 200 });
    } catch (error) {
        // Capture the exception in Sentry
        Sentry.captureException(error);
        console.error("Error fetching specializations:", error);

        return NextResponse.json(
            { error: "Failed to fetch specializations" },
            { status: 500 }
        );
    }
}
