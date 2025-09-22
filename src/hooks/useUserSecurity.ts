// src/hooks/useUserSecurity.ts
import { useQuery } from "@tanstack/react-query";
import { fetchSecuritySettings } from "@/lib/data-access/settings/data";

export function useUserSecurity() {
    return useQuery({
        queryKey: ["user-security"],
        queryFn: () => fetchSecuritySettings(),
    });
}
