// src/hooks/useFetchMessages.ts

import { useInfiniteQuery } from "@tanstack/react-query";
import { Message } from "@/lib/definitions";

async function fetchMessagesFromApi(conversationId: string, pageParam: number) {
    const response = await fetch(`/api/messaging/messages/${conversationId}?page=${pageParam}`);
    if (!response.ok) {
        throw new Error('Failed to fetch messages');
    }
    return response.json();
}

/**
 * Hook to fetch messages in a conversation with infinite scrolling
 */
export function useFetchMessages(conversationId: string) {
    return useInfiniteQuery<Message[], Error>({
        queryKey: ["messages", conversationId],
        queryFn: ({ pageParam = 1 }) => fetchMessagesFromApi(conversationId, pageParam as number),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length > 0 ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        enabled: !!conversationId,
    });
}
