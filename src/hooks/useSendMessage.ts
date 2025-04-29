// src/hooks/useSendMessage.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/lib/data-access/messaging/data";

/**
 * Hook to send a new message
 */
export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            conversationId,
            content,
        }: {
            conversationId: string;
            content: string;
        }) => sendMessage(conversationId, content),
        onSuccess: (_, { conversationId }) => {
            queryClient.invalidateQueries({ queryKey: ["messages", conversationId] }); // Corrected syntax
        },
    });
}
