// src/hooks/useFetchDoctorsByHospital.ts

import { useQuery } from "@tanstack/react-query";
import { fetchDoctorsByHospital } from "@/lib/data-access/doctors/data";
import { Role } from "@/lib/definitions";

export const useFetchDoctorsByHospital = (
    hospitalId: number,
    role: Role,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
) => {
    return useQuery({
        queryKey: ["doctorsByHospital", hospitalId, role, user],
        queryFn: () => fetchDoctorsByHospital(hospitalId, role, user),
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
        retry: 1, // Retry once if the request fails
        refetchOnWindowFocus: false, // Avoid refetching on window focus
        enabled: !!hospitalId, // Only fetch if hospitalId is provided
    });
};