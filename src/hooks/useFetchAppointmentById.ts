// src/hooks/useFetchAppointmentById.ts

import { useQuery } from "@tanstack/react-query";
import { fetchAppointmentById } from "@/lib/data-access/appointments/data";
import { Role } from "@/lib/definitions";

export const useFetchAppointmentById = (
    appointmentId: string,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
) => {
    return useQuery({
        queryKey: ["appointment", appointmentId],
        queryFn: () => fetchAppointmentById(appointmentId, user),
        enabled: !!appointmentId, // Only fetch if appointmentId is provided
    });
};
