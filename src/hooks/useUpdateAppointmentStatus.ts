// src/hooks/useUpdateAppointmentStatus.ts

import { useMutation } from "@tanstack/react-query";
import { updateAppointmentStatus } from "@/lib/data-access/appointments/data";
import { Role } from "@/lib/definitions";

export const useUpdateAppointmentStatus = () => {
    return useMutation({
        mutationFn: async ({
            appointmentId,
            updateData,
            user,
        }: {
            appointmentId: string;
            updateData: { status: string; reason: string };
            user?: { role: Role; hospitalId: number | null; userId: string | null };
        }) => {
            const updatedAppointment = await updateAppointmentStatus(appointmentId, updateData, user);
            if (!updatedAppointment) {
                throw new Error("Failed to update appointment status");
            }
            return updatedAppointment;
        },
        onError: (error) => {
            console.error("Error updating appointment status:", error);
        },
    });
};