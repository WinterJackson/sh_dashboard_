// src/hooks/useAddParticipant.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

async function addParticipant(conversationId: string, userId: string) {
    const response = await fetch(`/api/messaging/conversations/${conversationId}/participants`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
        throw new Error("Failed to add participant");
    }

    return response.json();
}

export function useAddParticipant() {
    const queryClient = useQueryClient();

    return useMutation(
        { 
            mutationFn: ({ conversationId, userId }: { conversationId: string, userId: string }) => addParticipant(conversationId, userId),
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries({ queryKey: ["conversations"] });
                queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
            }
        }
    );
}
