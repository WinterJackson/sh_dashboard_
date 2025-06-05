// src/app/api/appointments/[appointmentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { appointmentId: string } }
) {
    const { appointmentId } = params;

    try {
        const requestBody = await req.json();
        const { status, reason, date, timeFrom, timeTo, doctorId, hospitalId, type } = requestBody;

        const updateData: any = {};

        // Update status and related fields
        if (status) {
            updateData.status = status;

            // Update corresponding reason based on the status
            if (status === "Cancelled") {
                updateData.cancellationReason = reason;
            } else if (status === "Pending") {
                updateData.pendingReason = reason;
            }
        }

        // Update the appointment type if provided
        if (type) {
            updateData.type = type;
        }

        // Update other fields for rescheduling
        if (!status && (date || timeFrom || timeTo || doctorId || hospitalId)) {
            if (!date || !timeFrom || !timeTo || !doctorId || !hospitalId || !type) {
                return NextResponse.json(
                    { error: "All fields are required" },
                    { status: 400 }
                );
            }

            const appointmentDate = new Date(date);
            const [hoursFrom, minutesFrom] = timeFrom.split(":");
            appointmentDate.setHours(parseInt(hoursFrom), parseInt(minutesFrom));

            const appointmentEndAt = new Date(date);
            const [hoursTo, minutesTo] = timeTo.split(":");
            appointmentEndAt.setHours(parseInt(hoursTo), parseInt(minutesTo));

            updateData.appointmentDate = appointmentDate;
            updateData.appointmentEndAt = appointmentEndAt;
            updateData.doctorId = doctorId;
            updateData.hospitalId = hospitalId;
            updateData.type = type;
            updateData.status = "Rescheduled";
        }

        // Update the appointment in the database
        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId },
            data: updateData,
        });

        // Revalidate the appointments page to reflect the updates
        revalidatePath("/dashboard/appointments");

        return NextResponse.json(updatedAppointment, { status: 200 });
    } catch (error) {
        console.error("Error updating appointment:", error);
        return NextResponse.json(
            { error: "Error updating appointment" },
            { status: 500 }
        );
    }
}