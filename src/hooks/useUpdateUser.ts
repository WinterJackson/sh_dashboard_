// src/hooks/useUpdateUser.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUser } from "@/lib/data-access/settings/data";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { username: string; email: string }) => updateUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSettings"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update credentials");
        }
    });
}