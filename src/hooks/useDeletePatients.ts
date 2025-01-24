// src/hooks/useDeletePatients.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePatients } from "@/lib/data-access/patients/data";
import { Role } from "@/lib/definitions";

export const useDeletePatients = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            patientIds: number[];
            user?: {
                role: Role;
                hospitalId: number | null;
                userId: string | null;
            };
        }) => deletePatients(variables.patientIds, variables.user),
        onSuccess: () => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ["patients"] });
            queryClient.invalidateQueries({ queryKey: ["patientsByRole"] });
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
        onError: (error: Error) => {
            console.error("Patient deletion error:", error.message);
        },
    });
};
