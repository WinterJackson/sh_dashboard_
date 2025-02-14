// src/hooks/useUpdateEmail.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateEmail } from "@/lib/data-access/settings/data";

export function useUpdateEmail() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newEmail: string) => updateEmail(newEmail),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSettings"] });
            toast.success("Email updated successfully");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update email");
        },
    });
}
