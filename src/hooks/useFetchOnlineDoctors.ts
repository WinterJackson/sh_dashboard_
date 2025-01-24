// src/hooks/useFetchOnlineDoctors.ts

import { useQuery } from "@tanstack/react-query";
import { fetchOnlineDoctors } from "@/lib/data-access/doctors/data";
import { Role } from "@/lib/definitions";

export const useFetchOnlineDoctors = (user?: { role: Role; hospitalId: number | null; userId: string | null }) => {
    return useQuery({
        queryKey: ["onlineDoctors", user?.role, user?.hospitalId, user?.userId],
        queryFn: () => fetchOnlineDoctors(user),
        staleTime: 1000 * 60 * 10, // Cache data for 10 minutes
        retry: 1, // Retry once if the request fails
        refetchOnWindowFocus: false, // Avoid refetching on window focus
        enabled: !!user, // Only fetch if user is provided
    });
};