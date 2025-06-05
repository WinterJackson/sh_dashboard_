// src/hooks/useUpdateBasicInfo.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBasicInfo } from "@/lib/data-access/patients/data";
import type { Patient } from "@/lib/definitions";
import { getErrorMessage } from "@/hooks/getErrorMessage";

export interface BasicInfoInput {
    maritalStatus?: string;
    occupation?: string;
    address?: string;
    phoneNo?: string;
    email?: string;
}

export function useUpdateBasicInfo(patientId: number) {
    const queryClient = useQueryClient();

    return useMutation<Patient, Error, BasicInfoInput>({
        // mutation function
        mutationFn: async (data) => {
            try {
                return await updateBasicInfo(patientId, data);
            } catch (err) {
                throw new Error(getErrorMessage(err));
            }
        },
        // onSuccess: invalidate both list and detail
        onSuccess: (patient) => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
        },
    });
}
