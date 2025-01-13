// src/hooks/useCreateReferral.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReferral } from "@/lib/data-access/referrals/data";
import { Referral, Role } from "@/lib/definitions";

export const useCreateReferral = (user?: { role: Role; hospitalId: number | null }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (referralData: {
            patientId: number;
            patientName: string;
            gender: string;
            dateOfBirth: string;
            homeAddress?: string;
            state?: string;
            phoneNo: string;
            email: string;
            physicianName: string;
            physicianDepartment: string;
            physicianSpecialty: string;
            physicianEmail: string;
            physicianPhoneNumber: string;
            hospitalName: string;
            type: string;
            primaryCareProvider: string;
            referralAddress: string;
            referralPhone: string;
            reasonForConsultation: string;
            diagnosis: string;
            status: string;
        }) => createReferral(referralData, user),
        onSuccess: (newReferral: Referral | null) => {
            if (newReferral) {
                // Invalidate the referrals cache to reflect the new data
                queryClient.invalidateQueries({ queryKey: ["referrals"] });
            }
        },
        onError: (error) => {
            console.error("Error creating referral:", error);
        },
    });
};