// src/components/messaging/MessagePanel.tsx

"use client";

import React from "react";
import { Socket } from "socket.io-client";
import { Conversation, Message } from "@/lib/definitions";
import ChatWindow from "@/components/messaging/ChatWindow";

interface MessagePanelProps {
    socket: Socket | null;
    userId: string;
    selectedConversation: Conversation | null;
    onlineUsers: string[];
    isTyping: boolean;
    replyingTo: Message | null;
    setReplyingTo: (message: Message | null) => void;
    messages: Message[];
    fetchNextPage: () => void;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
    onSendMessage: (content: string, file?: File) => void;
    onToggleInfoPanel: () => void;
}

const MessagePanel: React.FC<MessagePanelProps> = ({
    socket,
    userId,
    selectedConversation,
    onlineUsers,
    isTyping,
    replyingTo,
    setReplyingTo,
    messages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    onSendMessage,
    onToggleInfoPanel,
}) => {
    if (!selectedConversation) {
        return (
            <div className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-800">
                <p className="text-gray-600 dark:text-gray-400">
                    Select a conversation to start messaging
                </p>
            </div>
        );
    }

    return (
        <ChatWindow
            socket={socket}
            selectedConversation={selectedConversation}
            userId={userId}
            onSendMessage={onSendMessage}
            onlineUsers={onlineUsers}
            isTyping={isTyping}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            messages={messages}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onToggleInfoPanel={onToggleInfoPanel}
        />
    );
};

export default MessagePanel;
