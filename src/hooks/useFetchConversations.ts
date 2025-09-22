// src/hooks/useFetchConversations.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchConversations } from "@/lib/data-access/conversations/data";
import { Conversation, Role } from "@/lib/definitions";

/**
 * Hook to fetch user conversations with infinite scrolling
 */
export function useFetchConversations(userId: string, role: Role, hospitalId?: number) {
    return useInfiniteQuery<{ conversations: Conversation[], totalConversations: number }, Error>({
        queryKey: ["conversations", userId, role, hospitalId],
        queryFn: ({ pageParam = 1 }) => fetchConversations(userId, role, hospitalId, pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((acc, page) => acc + page.conversations.length, 0);
            if (loadedCount < lastPage.totalConversations) {
                return allPages.length + 1;
            }
            return undefined;
        },
        initialPageParam: 1,
        enabled: !!userId && !!role,
    });
}
