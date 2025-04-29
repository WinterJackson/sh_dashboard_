// src/components/messaging/ChatHeader.tsx

import React from "react";
import { Conversation } from "@/lib/definitions";

interface ChatHeaderProps {
    userId: string; // Add userId as a required prop
    conversation: Conversation | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ userId, conversation }) => {
    // Get the other participant (exclude the logged-in user)
    const participant = conversation?.participants.find(
        (p) => p.user?.userId !== userId
    )?.user?.profile;

    return (
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
                <img
                    src={participant?.imageUrl || "/default-avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                    <p className="font-medium">
                        {participant?.firstName || "Unknown"}
                    </p>
                    <p className="text-sm text-green-500">Online</p>
                </div>
            </div>
            <div>
                {/* Additional header actions */}
                <button className="p-2 hover:bg-gray-100 rounded">Call</button>
                <button className="p-2 hover:bg-gray-100 rounded">Info</button>
            </div>
        </div>
    );
};

export default ChatHeader;
