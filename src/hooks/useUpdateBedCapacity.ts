// src/hooks/useUpdateBedCapacity.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import { updateBedCapacity } from "@/lib/data-access/beds/data";
import { BedCapacity } from "@/lib/definitions";

export function useUpdateBedCapacity() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            hospitalId,
            bedCapacityId,
            data,
        }: {
            hospitalId: number;
            bedCapacityId: string;
            data: Partial<BedCapacity>;
        }) => {
            try {
                const updatedCapacity = await updateBedCapacity(bedCapacityId, {
                    totalInpatientBeds: data.totalInpatientBeds,
                    generalInpatientBeds: data.generalInpatientBeds,
                    cots: data.cots,
                    maternityBeds: data.maternityBeds,
                    emergencyCasualtyBeds: data.emergencyCasualtyBeds,
                    intensiveCareUnitBeds: data.intensiveCareUnitBeds,
                    highDependencyUnitBeds: data.highDependencyUnitBeds,
                    isolationBeds: data.isolationBeds,
                    generalSurgicalTheatres: data.generalSurgicalTheatres,
                    maternitySurgicalTheatres: data.maternitySurgicalTheatres,
                });
                return updatedCapacity;
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                Sentry.captureException(error, {
                    extra: { errorMessage, hospitalId, bedCapacityId, data },
                });
                throw error;
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["hospital", variables.hospitalId],
            });
        },
    });
}
