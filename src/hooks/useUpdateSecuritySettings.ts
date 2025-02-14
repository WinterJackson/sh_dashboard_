// src/hooks/useUpdateSecuritySettings.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    updateSecuritySettings,
    type SecuritySettings,
} from "@/lib/data-access/settings/data";

export function useUpdateSecuritySettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (settings: SecuritySettings) =>
            updateSecuritySettings(settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSettings"] });
            toast.success("Security settings updated");
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update security settings");
        },
    });
}
