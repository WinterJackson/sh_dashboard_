// src/components/messaging/MessageItem.tsx

import React from "react";
import { Message } from "@/lib/definitions";

interface MessageItemProps {
    message: Message;
    isOwnMessage: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isOwnMessage }) => {
    return (
        <div
            className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
            } mb-2`}
        >
            <div
                className={`max-w-xs p-3 rounded-lg ${
                    isOwnMessage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                }`}
            >
                <p>{message.content}</p>
                <span className="text-xs text-gray-600">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

export default MessageItem;
