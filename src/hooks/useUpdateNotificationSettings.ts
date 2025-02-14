// src/hooks/useUpdateNotificationSettings.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateNotificationSettings } from "@/lib/data-access/settings/data";
import { NotificationSettings } from "@/lib/definitions";

export function useUpdateNotificationSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            settings: Omit<
                NotificationSettings,
                "notificationSettingsId" | "userId" | "user"
            >
        ) => updateNotificationSettings(settings),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userSettings"] });
            toast.success("Notification preferences updated");
        },
        onError: (error: Error) => {
            toast.error(
                error.message || "Failed to update notification preferences"
            );
        },
    });
}
