// src/hooks/useFetchDoctorIdByUserId.ts

import { useQuery } from "@tanstack/react-query";
import { fetchDoctorIdByUserId } from "@/lib/data-access/doctors/data";
import { Role } from "@/lib/definitions";

export const useFetchDoctorIdByUserId = (
    userId: string,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
) => {
    return useQuery({
        queryKey: ["doctorIdByUserId", userId, user],
        queryFn: () => fetchDoctorIdByUserId(userId, user),
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
        retry: 1, // Retry once if the request fails
        refetchOnWindowFocus: false, // Avoid refetching on window focus
        enabled: !!userId, // Only fetch if userId is provided
    });
};