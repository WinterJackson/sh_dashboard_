// src/app/api/appointments/lastfortnight/route.ts

import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
const prisma = require("@/lib/prisma");

export async function GET(req: NextRequest) {
    try {
        // Calculate date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 13);

        // Fetch appointments from the last 14 days
        const appointments = await prisma.appointment.findMany({
            where: {
                appointmentDate: {
                    gte: fourteenDaysAgo,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Include today
                },
            },
            include: {
                doctor: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                patient: true,
            },
        });

        return NextResponse.json(appointments, { status: 200 });
    } catch (error) {
        Sentry.captureException(error); // Log the error to Sentry
        console.error("Error fetching appointments for the last 14 days:", error);
        return NextResponse.json(
            { error: "Error fetching appointments for the last 14 days" },
            { status: 500 }
        );
    }
}
