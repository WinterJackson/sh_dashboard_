// src/hooks/useFetchPatientsByRole.ts

import { useQuery } from "@tanstack/react-query";
import { fetchPatientsByRole } from "@/lib/data-access/patients/data";
import { Role } from "@/lib/definitions";

export const useFetchPatientsByRole = (user?: { role: Role; hospitalId: number | null }) => {
    return useQuery({
        queryKey: ["patientsByRole", user],
        queryFn: () => fetchPatientsByRole(user),
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
        retry: 1, // Retry once if the request fails
        refetchOnWindowFocus: false, // Avoid refetching on window focus
        enabled: !!user, // Only fetch if user is provided
    });
};