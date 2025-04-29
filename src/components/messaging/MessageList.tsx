// src/components/messaging/MessageList.tsx

import React, { useEffect, useRef } from "react";
import { Message } from "@/lib/definitions";
import MessageItem from "./MessageItem";

interface MessageListProps {
    messages: Message[];
    currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4">
            {messages.map((msg) => (
                <MessageItem
                    key={msg.messageId}
                    message={msg}
                    isOwnMessage={msg.senderId === currentUserId}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
