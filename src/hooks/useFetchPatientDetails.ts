// src/hooks/useFetchPatientDetails.ts

import { useQuery } from "@tanstack/react-query";
import { fetchPatientDetails } from "@/lib/data-access/patients/data";
import { Role } from "@/lib/definitions";

export const useFetchPatientDetails = (
    name: string,
    user: { role: Role; hospitalId: number | null; userId: string | null }
) => {
    return useQuery({
        queryKey: ["patientDetails", name, user?.role, user?.hospitalId],
        queryFn: () => fetchPatientDetails(name, user),
        enabled: !!name, // Only fetch if name is provided
    });
};
