// src/lib/data-access/specializations/data.ts

"use server";

import { Specialization } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

/**
 * Fetches a list of specializations.
 * @param user - Optional user object with role and hospitalId for validation.
 * @returns List of specializations.
 */
export async function fetchSpecializations(
    user?: { role: string; hospitalId: number | null }
): Promise<Specialization[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role,
            hospitalId: session.user.hospitalId,
        };
    }

    try {
        return await prisma.specialization.findMany({
            select: {
                specializationId: true,
                name: true,
            },
        });
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Failed to fetch specializations:", errorMessage);
        return [];
    }
}