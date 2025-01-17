// src/hooks/useFetchHospitalServices.ts

import { useQuery } from "@tanstack/react-query";
import { fetchHospitalServices } from "@/lib/data-access/services/data";
import { Role } from "@/lib/definitions";

export const useFetchHospitalServices = (user?: { role: Role; hospitalId: number | null; }) => {
    return useQuery({
        queryKey: ["hospitalServices", user],
        queryFn: () => fetchHospitalServices(user),
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
        retry: 1, // Retry once if the request fails
        refetchOnWindowFocus: false, // Avoid refetching on window focus
        enabled: !!user, // Only fetch if user is provided
    });
};
