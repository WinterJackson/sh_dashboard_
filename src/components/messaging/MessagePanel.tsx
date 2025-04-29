// src/components/messaging/MessagePanel.tsx

"use client";

import React from "react";
import MessageList from "@/components/messaging/MessageList";
import MessageInput from "@/components/messaging/MessageInput";
import { useFetchMessages } from "@/hooks/useFetchMessages";
import { useSendMessage } from "@/hooks/useSendMessage";

interface MessagePanelProps {
    userId: string;
    selectedConversationId: string | null;
}

const MessagePanel: React.FC<MessagePanelProps> = ({ userId, selectedConversationId }) => {
    // Fetch messages for the selected conversation
    const { data: messages, isLoading: loadingMessages } = useFetchMessages(
        selectedConversationId || ""
    );

    // Mutation hook for sending messages
    const sendMessageMutation = useSendMessage();

    // Handle sending a message
    const handleSendMessage = (content: string) => {
        if (selectedConversationId) {
            sendMessageMutation.mutate({
                conversationId: selectedConversationId,
                content,
            });
        }
    };

    return (
        <>
            {/* Message List */}
            {selectedConversationId ? (
                <>
                    <MessageList
                        messages={messages || []}
                        currentUserId={userId}
                    />
                    <MessageInput onSend={handleSendMessage} />
                </>
            ) : (
                <div className="flex flex-1 items-center justify-center">
                    <p>Select a conversation to start messaging</p>
                </div>
            )}
        </>
    );
};

export default MessagePanel;
