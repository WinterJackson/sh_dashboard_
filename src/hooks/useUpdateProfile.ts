// src/hooks/useUpdateProfile.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    updateProfile,
    type ProfileUpdateData,
} from "@/lib/data-access/settings/data";

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ProfileUpdateData) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSettings"] });
            toast.success("Profile updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update profile");
        },
    });
}
