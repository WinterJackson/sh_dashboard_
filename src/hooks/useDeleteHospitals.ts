// src/hooks/useDeleteHospitals.ts

import { useMutation } from "@tanstack/react-query";
import { deleteHospitals } from "@/lib/data-access/hospitals/data";

export const useDeleteHospitals = () => {
    return useMutation({
        mutationFn: (hospitalIds: number[]) => deleteHospitals(hospitalIds),
        onError: (error) => {
            console.error("Hospital deletion failed:", error);
        },
    });
};
