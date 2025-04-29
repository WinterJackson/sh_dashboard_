// src/components/messaging/MessagingContainer.tsx

"use client";

import React, { useState } from "react";
import ChatHeader from "@/components/messaging/ChatHeader";
import MessagePanel from "@/components/messaging/MessagePanel";
import { Conversation } from "@/lib/definitions";

interface MessagingContainerProps {
    userId: string;
    conversations: Conversation[];
}

const MessagingContainer: React.FC<MessagingContainerProps> = ({ userId, conversations }) => {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    return (
        <div className="flex flex-col flex-1">
            {/* Chat Header */}
            <ChatHeader
                userId={userId}
                conversation={conversations.find(
                    (conv) => conv.conversationId === selectedConversationId
                ) || null}
            />

            {/* Client Component for Messages */}
            <MessagePanel userId={userId} selectedConversationId={selectedConversationId} />
        </div>
    );
};

export default MessagingContainer;
