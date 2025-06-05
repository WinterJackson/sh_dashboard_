// src/hooks/useAddDepartment.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import {
    addDepartment,
    CreateDepartmentInput,
} from "@/lib/data-access/departments/data";

export function useAddDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            hospitalId,
            departmentData,
        }: {
            hospitalId: number;
            departmentData: CreateDepartmentInput;
        }) => {
            try {
                const newDept = await addDepartment(hospitalId, {
                    name: departmentData.name,
                    type: departmentData.type,
                    description: departmentData.description,
                    headOfDepartment: departmentData.headOfDepartment,
                    contactEmail: departmentData.contactEmail,
                    contactPhone: departmentData.contactPhone,
                    location: departmentData.location,
                    establishedYear: departmentData.establishedYear,
                });
                return newDept;
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                Sentry.captureException(error, {
                    extra: { errorMessage, hospitalId, departmentData },
                });
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["hospital", variables.hospitalId],
            });
            queryClient.invalidateQueries({ queryKey: ["departments"] });
        },
    });
}
