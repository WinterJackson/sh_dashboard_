// src/hooks/useDeleteDepartment.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import { deleteDepartment } from "@/lib/data-access/departments/data";

export function useDeleteDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            hospitalId,
            departmentId,
        }: {
            hospitalId: number;
            departmentId: number;
        }) => {
            try {
                await deleteDepartment(hospitalId, departmentId);
                return { departmentId };
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                Sentry.captureException(error, {
                    extra: { errorMessage, hospitalId, departmentId },
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
