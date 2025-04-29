// src/hooks/useFetchMessages.ts

import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "@/lib/data-access/messaging/data";
import { Message } from "@/lib/definitions";

/**
 * Hook to fetch messages in a conversation
 */
export function useFetchMessages(conversationId: string) {
    return useQuery<Message[]>({
        queryKey: ["messages", conversationId],
        queryFn: () => fetchMessages(conversationId),
        enabled: !!conversationId,
    });
}
