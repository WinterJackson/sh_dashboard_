// src/hooks/useFetchHospitals.ts

import { useQuery } from "@tanstack/react-query";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { Role } from "@/lib/definitions";

export const useFetchHospitals = (user?: { role: Role; hospitalId: number | null; userId: string | null }) => {
    return useQuery({
        queryKey: ["hospitals", user?.role, user?.hospitalId],
        queryFn: () => fetchHospitals(user),
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
        retry: 1, // Retry once if the request fails
        refetchOnWindowFocus: false, // Avoid refetching on window focus
        enabled: !!user, // Only fetch if user is provided
    });
};
