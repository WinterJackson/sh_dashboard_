// src/lib/data-access/specializations/data.ts

"use server";

import { Specialization, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");

/**
 * Fetches a list of specializations.
 */
export async function fetchSpecializations() {
    
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
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
        Sentry.captureException(error);
        throw new Error("Failed to fetch specializations");
    }
}