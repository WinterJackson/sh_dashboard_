// src/components/messaging/ChatSidebar.tsx

import React from "react";
import { Conversation } from "@/lib/definitions";

interface ChatSidebarProps {
    userId: string; // Add userId as a required prop
    conversations: Conversation[];
    selectedConversationId: string | null;
    onSelectConversation: (conversationId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    userId,
    conversations,
    selectedConversationId,
    onSelectConversation,
}) => {
    return (
        <div className="w-1/4 border-r border-gray-200 p-4">
            <input
                type="text"
                placeholder="Search..."
                className="mb-4 w-full p-2 border rounded"
            />
            <ul>
                {conversations.map((conv) => {
                    // Get the other participant (exclude the logged-in user)
                    const otherParticipant = conv.participants.find(
                        (p) => p.user?.userId !== userId
                    );

                    return (
                        <li
                            key={conv.conversationId}
                            onClick={() =>
                                onSelectConversation(conv.conversationId)
                            }
                            className={`p-2 cursor-pointer rounded ${
                                selectedConversationId === conv.conversationId
                                    ? "bg-blue-100"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <div className="flex items-center">
                                <img
                                    src={
                                        otherParticipant?.user?.profile
                                            ?.imageUrl || "/default-avatar.png"
                                    }
                                    alt="avatar"
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <div>
                                    <p className="font-medium">
                                        {otherParticipant?.user?.profile
                                            ?.firstName || "Unknown"}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        Last message preview...
                                    </p>
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ChatSidebar;
