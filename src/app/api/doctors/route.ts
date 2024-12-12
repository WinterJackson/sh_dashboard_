// File: src/app/api/doctors/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
    addDoctorAPI,
    fetchAllDoctors,
    fetchDoctorDetails,
    fetchOnlineDoctors,
} from "@/lib/data-access/doctors/data";
import { Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";

export const dynamic = 'force-dynamic';

/**
 * GET: Retrieve the list of doctors.
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { role, hospitalId } = session.user;

        const { searchParams } = new URL(req.url);
        const filter = searchParams.get("filter"); // e.g., "online", "all", or specific doctorId
        const doctorId = searchParams.get("doctorId");

        let response;

        if (filter === "online") {
            response = await fetchOnlineDoctors(hospitalId, role as Role);
        } else if (doctorId) {
            const doctorIdNumber = parseInt(doctorId, 10);
            if (isNaN(doctorIdNumber)) {
                return NextResponse.json(
                    { error: "Invalid doctorId" },
                    { status: 400 }
                );
            }
            response = await fetchDoctorDetails(
                doctorIdNumber,
                hospitalId,
                role as Role
            );
        } else {
            response = await fetchAllDoctors(hospitalId, role as Role);
        }

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST: Create a new doctor.
 */
export async function POST(req: NextRequest) {
    try {
        const doctorData = await req.json();
        const doctor = await addDoctorAPI(doctorData);
        return NextResponse.json(doctor, { status: 201 });
    } catch (error: any) {
        // Capture the exception in Sentry
        Sentry.captureException(error);

        console.error("Error creating doctor:", error);

        if (error.message.includes("Duplicate email")) {
            return NextResponse.json(
                { error: "Email address is already in use" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: error.message || "Failed to create doctor" },
            { status: 500 }
        );
    }
}
