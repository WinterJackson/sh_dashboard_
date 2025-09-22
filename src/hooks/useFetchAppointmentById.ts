// src/hooks/useFetchAppointmentById.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchAppointmentById } from "@/lib/data-access/appointments/data";
import { Appointment, Role } from "@/lib/definitions";

export function useFetchAppointmentById(
    appointmentId?: string,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): UseQueryResult<Appointment | null, Error> {
    return useQuery<Appointment | null, Error>({
        queryKey: ["appointment", appointmentId, user?.role, user?.hospitalId],
        queryFn: () => fetchAppointmentById(appointmentId!, user),
        enabled: !!appointmentId && !!user,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });
}