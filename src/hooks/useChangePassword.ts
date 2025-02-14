// src/hooks/useChangePassword.ts

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePassword } from "@/lib/data-access/settings/data";

export function useChangePassword() {
    return useMutation({
        mutationFn: ({
            currentPassword,
            newPassword,
        }: {
            currentPassword: string;
            newPassword: string;
        }) => changePassword(currentPassword, newPassword),
        onSuccess: () => {
            toast.success("Password changed successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to change password");
        },
    });
}
