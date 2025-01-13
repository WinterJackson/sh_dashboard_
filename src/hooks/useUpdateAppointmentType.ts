// src/hooks/useUpdateAppointmentType.ts

import { useMutation } from "@tanstack/react-query";
import { updateAppointmentType } from "@/lib/data-access/appointments/data";
import { Role } from "@/lib/definitions";

export const useUpdateAppointmentType = () => {
    return useMutation({
        mutationFn: async ({
            appointmentId,
            newType,
            user,
        }: {
            appointmentId: string;
            newType: string;
            user?: { role: Role; hospitalId: number | null; userId: string | null };
        }) => {
            const result = await updateAppointmentType(appointmentId, newType, user);
            if (!result.success) {
                throw new Error("Failed to update appointment type");
            }
            return result.updatedType;
        },
        onError: (error) => {
            console.error("Error updating appointment type:", error);
        },
    });
};