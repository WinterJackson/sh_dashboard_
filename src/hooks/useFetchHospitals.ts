// src/hooks/useFetchHospitals.ts

import { useQuery } from "@tanstack/react-query";
import { loadHospitals } from "@/lib/data-access/hospitals/loaders";
import { Role } from "@/lib/definitions";

export const useFetchHospitals = (user?: { role: Role; hospitalId: number | null; userId: string | null }, options?: object) => {
    return useQuery({
        queryKey: ["hospitals", user?.role, user?.hospitalId],
        queryFn: () => loadHospitals(user),
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
        retry: 1, // Retry once if the request fails
        refetchOnWindowFocus: false, // Avoid refetching on window focus
        enabled: !!user, // Only fetch if user is provided
        ...options,
    });
};