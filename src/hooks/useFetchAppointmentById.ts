// src/hooks/useFetchAppointmentById.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAppointmentById } from "@/lib/data-access/appointments/data";
import { Appointment } from "@/lib/definitions";

export function useFetchAppointmentById(
    appointmentId?: string
): UseQueryResult<Appointment | null, Error> {
    return useQuery<Appointment | null, Error>({
        queryKey: ["appointment", appointmentId],
        queryFn: () => fetchAppointmentById(appointmentId!),
        enabled: Boolean(appointmentId),
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}
