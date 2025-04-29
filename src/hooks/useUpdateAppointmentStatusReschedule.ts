// src/hooks/useUpdateAppointmentStatusReschedule.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatusReschedule } from "@/lib/data-access/appointments/data";
import { Role } from "@/lib/definitions";

export const useUpdateAppointmentStatusReschedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            appointmentId,
            updateData,
            user,
        }: {
            appointmentId: string;
            updateData: {
                date: string;
                timeFrom?: string;
                timeTo?: string;
                doctorId: number;
                hospitalId: number;
                type: string;
            };
            user?: {
                role: Role;
                hospitalId: number | null;
                userId: string | null;
            };
        }) =>
            updateAppointmentStatusReschedule(appointmentId, updateData, user),
        onSuccess: () => {
            // Invalidate appointments cache to reflect changes
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
        onError: (error) => {
            console.error("Error updating reschedule status:", error);
        },
    });
};
