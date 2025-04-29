// src/hooks/useFetchConversations.ts

import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "@/lib/data-access/messaging/data";
import { Conversation } from "@/lib/definitions";

/**
 * Hook to fetch user conversations
 */
export function useFetchConversations(userId: string) {
    return useQuery<Conversation[]>({
        queryKey: ["conversations", userId],
        queryFn: () => fetchConversations(userId),
        staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
        retry: 1, // Retry once if the request fails
        refetchOnWindowFocus: false, // Avoid refetching on window focus
        enabled: !!userId, // Only fetch if userId is provided
    });
}