// src/hooks/useAddHospital.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHospital } from "@/lib/data-access/hospitals/data";
import { Hospital } from "@/lib/definitions";

export const useAddHospital = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (hospitalData: Partial<Hospital>) => addHospital(hospitalData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hospitals"] });
        },
        onError: (error) => {
            console.error("Error adding hospital:", error);
        },
    });
};