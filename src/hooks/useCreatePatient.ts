// src/hooks/useCreatePatient.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createPatient,
    CreatePatientInput,
} from "@/lib/data-access/patients/data";
import { Patient, Role } from "@/lib/definitions";

export const useCreatePatient = (userContext: {
    role: Role;
    hospitalId: number;
}) => {
    const queryClient = useQueryClient();

    return useMutation<
        Patient,
        Error,
        Omit<CreatePatientInput, "hospitalId" | "createdByRole">
    >({
        mutationFn: (formData) => {
            if (!userContext) throw new Error("User context is required");
            const { role, hospitalId } = userContext;
            return createPatient({
                ...formData,
                hospitalId,
                createdByRole: role,
            });
        },
        onSuccess: (newPatient) => {
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            queryClient.invalidateQueries({
                queryKey: ["patients", "details", newPatient.patientId],
            });
        },
        onError: (error: any) => {
            console.error("Error creating patient:", error);
        },
    });
};
