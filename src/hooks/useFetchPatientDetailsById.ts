// src/hooks/useFetchPatientDetailsById.ts

import { useQuery } from "@tanstack/react-query";
import { fetchPatientDetailsById } from "@/lib/data-access/patients/data";

export const useFetchPatientDetailsById = (patientId: number) => {
    return useQuery({
        queryKey: ["patient", patientId],
        queryFn: () => fetchPatientDetailsById(patientId),
        enabled: !!patientId,
    });
};
