// src/hooks/useMarkOnboardingComplete.ts

import { useMutation } from "@tanstack/react-query";
import { markOnboardingComplete } from "@/lib/data-access/user/data";

export const useMarkOnboardingComplete = () => {
    return useMutation({
        mutationFn: async (userId: string) => {
            return await markOnboardingComplete(userId);
        },
        onSuccess: () => {
            console.log("Onboarding marked as complete");
        },
        onError: (error) => {
            console.error("Onboarding update error:", error);
        },
    });
};
