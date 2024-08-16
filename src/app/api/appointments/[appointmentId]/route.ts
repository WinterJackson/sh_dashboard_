// src/app/api/appointments/[appointmentId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { revalidatePath } from "next/cache";
import { Role } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

export async function PATCH(
    req: NextRequest,
    { params }: { params: { appointmentId: string } }
) {
    const { appointmentId } = params;
    const token = await getToken({ req });

    // Ensure the user is authorized
    if (
        !token ||
        ![Role.SUPER_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE].includes(
            token.role as Role
        )
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const requestBody = await req.json();
        // console.log("Received PATCH request for appointmentId:", appointmentId);
        // console.log("Request Body:", requestBody);

        const {
            status,
            reason,
            date,
            timeFrom,
            timeTo,
            doctorId,
            hospitalId,
            type,
        } = requestBody;

        const updateData: any = {};

        if (status) {
            updateData.status = status;

            // Update corresponding reason based on the status
            if (status === "Cancelled") {
                updateData.cancellationReason = reason;
            } else if (status === "Pending") {
                updateData.pendingReason = reason;
            }
            // console.log("Status update:", { status, reason });
        } else {
            // Update other fields only if status is not being updated
            if (
                !date ||
                !timeFrom ||
                !timeTo ||
                !doctorId ||
                !hospitalId ||
                !type
            ) {
                console.error("Missing fields in the request body");
                return NextResponse.json(
                    { error: "All fields are required" },
                    { status: 400 }
                );
            }

            const appointmentDate = new Date(date);
            const [hoursFrom, minutesFrom] = timeFrom.split(":");
            appointmentDate.setHours(
                parseInt(hoursFrom),
                parseInt(minutesFrom)
            );

            const appointmentEndAt = new Date(date);
            const [hoursTo, minutesTo] = timeTo.split(":");
            appointmentEndAt.setHours(parseInt(hoursTo), parseInt(minutesTo));

            updateData.appointmentDate = appointmentDate;
            updateData.appointmentEndAt = appointmentEndAt;
            updateData.doctorId = doctorId;
            updateData.hospitalId = hospitalId;
            updateData.type = type;
            updateData.status = "Rescheduled";

            // console.log("Reschedule data:", {
            //     appointmentDate,
            //     appointmentEndAt,
            //     doctorId,
            //     hospitalId,
            //     type,
            // });
        }

        // console.log("Updating appointment with data:", updateData);

        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId: appointmentId },
            data: updateData,
        });

        // console.log("Appointment updated successfully:", updatedAppointment);

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
