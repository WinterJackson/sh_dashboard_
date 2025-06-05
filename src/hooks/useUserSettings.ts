// src/hooks/useUserSettings.ts

import { useQuery } from "@tanstack/react-query";
import { fetchUserSettings } from "@/lib/data-access/settings/data";
import type { UserSettingsData } from "@/lib/definitions";

export function useUserSettings() {
    return useQuery<UserSettingsData>({
        queryKey: ["userSettings"],
        queryFn: () => fetchUserSettings(),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
    });
}