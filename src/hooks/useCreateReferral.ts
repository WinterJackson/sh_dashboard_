// src/hooks/useCreateReferral.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReferral } from "@/lib/data-access/referrals/data";
import { Referral, Role, ReferralType, ReferralStatus } from "@/lib/definitions";

export const useCreateReferral = (user?: { role: Role; hospitalId: number | null }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (referralData: {
            patientId: number;
            patientName: string;
            gender: string;
            dateOfBirth: string;
            homeAddress?: string;
            county?: string;
            phoneNo: string;
            email: string;
            referringDoctorName: string;
            departmentName: string;
            specializationName: string;
            referringDoctorEmail: string;
            referringDoctorPhoneNo: string;
            hospitalName: string;
            type: ReferralType;
            primaryCareProvider: string;
            referralAddress: string;
            referralPhone: string;
            reasonForConsultation: string;
            diagnosis: string;
            status: ReferralStatus;
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