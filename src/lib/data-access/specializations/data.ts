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
 */
export async function fetchSpecializations(): Promise<Specialization[]> {
    
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return [];
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
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch specializations:", errorMessage);
        return [];
    }
}