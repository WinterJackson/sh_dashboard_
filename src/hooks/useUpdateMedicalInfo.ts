// src/hooks/useUpdateMedicalInfo.ts

import { useMutation } from "@tanstack/react-query";
import { updateMedicalInfo } from "@/lib/data-access/patients/data";
import { MedicalInformation } from "@/lib/definitions";

export const useUpdateMedicalInfo = () => {
    return useMutation({
        mutationFn: ({
            patientId,
            data,
        }: {
            patientId: number;
            data: Partial<MedicalInformation>;
        }) => updateMedicalInfo(patientId, data),
    });
};
