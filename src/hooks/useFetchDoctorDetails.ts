// src/hooks/useFetchDoctorDetails.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDoctorDetails } from "@/lib/data-access/doctors/data";
import { Role } from "@/lib/definitions";

export const useFetchDoctorDetails = (
    doctorId: number,
    user: { role: Role; hospitalId: number | null }
) => {
    return useQuery({
        queryKey: ["doctorDetails", doctorId, user.role, user.hospitalId],
        queryFn: () => fetchDoctorDetails(doctorId, user),
        staleTime: 1000 * 60 * 10, // 10 minutes cache
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!doctorId, // Only fetch when doctorId is available
    });
};