// src/components/messaging/MessagingContainer.tsx

"use client";

import React, { useState } from "react";
import { Socket } from "socket.io-client";
import { Conversation, Message } from "@/lib/definitions";
import ChatHeader from "@/components/messaging/ChatHeader";
import MessagePanel from "@/components/messaging/MessagePanel";

interface MessagingContainerProps {
    socket: Socket | null;
    userId: string;
    conversations: Conversation[];
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
    onAudioCall: () => void;
    onVideoCall: () => void;
}

const MessagingContainer: React.FC<MessagingContainerProps> = ({
    socket,
    userId,
    conversations,
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
    onAudioCall,
    onVideoCall,
}) => {
    const [selectedConversationId, setSelectedConversationId] = useState<
        string | null
    >(null);

    const selectedConversation =
        conversations.find(
            (conv) => conv.conversationId === selectedConversationId
        ) || null;

    return (
        <div className="flex flex-col flex-1">
            <ChatHeader
                userId={userId}
                conversation={selectedConversation}
                onlineUsers={onlineUsers}
                isTyping={isTyping}
                onAudioCall={onAudioCall}
                onVideoCall={onVideoCall}
                onToggleInfoPanel={onToggleInfoPanel}
            />

            <MessagePanel
                socket={socket}
                userId={userId}
                selectedConversation={selectedConversation}
                onlineUsers={onlineUsers}
                isTyping={isTyping}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                messages={messages}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onSendMessage={onSendMessage}
                onToggleInfoPanel={onToggleInfoPanel}
            />
        </div>
    );
};

export default MessagingContainer;
