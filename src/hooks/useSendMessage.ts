// src/hooks/useSendMessage.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/lib/data-access/messaging/data";
import { Message, MessageType } from "@/lib/definitions";
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook to send a new message
 */
export function useSendMessage(currentUserId: string, currentUsername: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { conversationId: string; content: string; messageType?: MessageType; replyToMessageId?: string; isUrgent?: boolean, replyingTo?: Message | null }) => 
            sendMessage(data.conversationId, data.content, data.messageType, data.replyToMessageId, data.isUrgent),
        
        onMutate: async (newMessage) => {
            await queryClient.cancelQueries({ queryKey: ['messages', newMessage.conversationId] });

            const previousMessages = queryClient.getQueryData<Message[]>(['messages', newMessage.conversationId]);

            const optimisticMessage: Partial<Message> = {
                messageId: uuidv4(),
                content: newMessage.content,
                senderId: currentUserId,
                sender: { username: currentUsername } as any,
                createdAt: new Date(),
                messageType: newMessage.messageType || MessageType.TEXT,
                isUrgent: newMessage.isUrgent || false,
                status: 'sending',
                replyToMessageId: newMessage.replyToMessageId,
                replyToMessage: newMessage.replyingTo,
            };

            queryClient.setQueryData(['messages', newMessage.conversationId], (old: any) => {
                if (!old || !old.pages) {
                    return { pages: [[optimisticMessage]], pageParams: [undefined] };
                }
                const newPages = [...old.pages];
                const lastPageIndex = newPages.length - 1;
                newPages[lastPageIndex] = [...newPages[lastPageIndex], optimisticMessage];
                return {
                    ...old,
                    pages: newPages,
                };
            });

            return { previousMessages };
        },

        onError: (err, newMessage, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData(['messages', newMessage.conversationId], context.previousMessages);
            }
        },

        onSettled: (data, error, variables) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
}