// src/hooks/useUpdateAppointmentStatusReschedule.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAppointmentStatusReschedule } from "@/lib/data-access/appointments/data";

export const useUpdateAppointmentStatusReschedule = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            appointmentId,
            updateData,
        }: {
            appointmentId: string;
            updateData: {
                date: string;
                timeFrom: string;
                timeTo: string;
                doctorId: number;
                hospitalId: number;
                type: string;
            };
        }) => updateAppointmentStatusReschedule(appointmentId, updateData),
        onSuccess: () => {
            // Invalidate appointments cache to reflect changes
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
        onError: (error) => {
            console.error("Error updating reschedule status:", error);
        },
    });
};
