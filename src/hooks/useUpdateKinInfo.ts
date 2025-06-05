// src/hooks/useUpdateBasicInfo.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKinInfo } from "@/lib/data-access/patients/data";
import type { Patient } from "@/lib/definitions";
import { getErrorMessage } from "@/hooks/getErrorMessage";

export interface KinInfoInput {
    nextOfKinName?: string;
    nextOfKinRelationship?: string;
    nextOfKinHomeAddress?: string;
    nextOfKinPhoneNo?: string;
    nextOfKinEmail?: string;
}

export function useUpdateKinInfo(patientId: number) {
    const queryClient = useQueryClient();

    return useMutation<Patient, Error, KinInfoInput>({
        mutationFn: async (data) => {
            try {
                return await updateKinInfo(patientId, data);
            } catch (err) {
                throw new Error(getErrorMessage(err));
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
        },
    });
}
