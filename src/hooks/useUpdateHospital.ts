// src/hooks/useUpdateHospital.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import { updateHospital } from "@/lib/data-access/hospitals/data";
import { Hospital } from "@/lib/definitions";

export function useUpdateHospital() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            hospitalId,
            data,
        }: {
            hospitalId: number;
            data: Partial<Hospital>;
        }) => {
            try {
                const updatedHospital = await updateHospital(hospitalId, {
                    hospitalName: data.hospitalName,
                    hospitalLink: data.hospitalLink,
                    phone: data.phone,
                    email: data.email,
                    referralCode: data.referralCode,
                    kephLevel: data.kephLevel,
                    regulatoryBody: data.regulatoryBody,
                    ownershipType: data.ownershipType,
                    facilityType: data.facilityType,
                    nhifAccreditation: data.nhifAccreditation,
                    open24Hours: data.open24Hours,
                    openWeekends: data.openWeekends,
                    regulated: data.regulated,
                    regulationStatus: data.regulationStatus,
                    regulatingBody: data.regulatingBody,
                    registrationNumber: data.registrationNumber,
                    licenseNumber: data.licenseNumber,
                    category: data.category,
                    owner: data.owner,
                    county: data.county,
                    subCounty: data.subCounty,
                    ward: data.ward,
                    town: data.town,
                    streetAddress: data.streetAddress,
                    nearestLandmark: data.nearestLandmark,
                    plotNumber: data.plotNumber,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    emergencyPhone: data.emergencyPhone,
                    emergencyEmail: data.emergencyEmail,
                    website: data.website,
                    logoUrl: data.logoUrl,
                    operatingHours: data.operatingHours,
                    description: data.description,
                });
                return updatedHospital;
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                Sentry.captureException(error, {
                    extra: { errorMessage, hospitalId, data },
                });
                throw error;
            }
        },
        onSuccess: (updatedHospital) => {
            queryClient.invalidateQueries({
                queryKey: ["hospital", updatedHospital.hospitalId],
            });
            queryClient.invalidateQueries({ queryKey: ["hospitals"] });
        },
    });
}
