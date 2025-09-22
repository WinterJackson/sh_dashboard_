// src/components/messaging/MessageList.tsx

"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import { Message } from "@/lib/definitions";
import MessageItem from "./MessageItem";
import { useInView } from "react-intersection-observer";
import { ChevronDown } from "lucide-react";

interface MessageListProps {
    socket: Socket | null;
    messages: Message[];
    currentUserId: string;
    setReplyingTo: (message: Message | null) => void;
    fetchNextPage: () => void;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
}

const MessageList: React.FC<MessageListProps> = ({
    socket,
    messages,
    currentUserId,
    setReplyingTo,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
}) => {
    const { ref, inView } = useInView();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showScrollToBottom, setShowScrollToBottom] = React.useState(false);

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages.length, scrollToBottom]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop > clientHeight + 200) {
            setShowScrollToBottom(true);
        } else {
            setShowScrollToBottom(false);
        }
    };

    return (
        <div
            className="flex-1 overflow-y-auto p-4 relative bg-background"
            onScroll={handleScroll}
        >
            {isFetchingNextPage && (
                <div className="text-center">Loading more...</div>
            )}
            <div ref={ref} />
            {messages.map((msg) => (
                <MessageItem
                    key={msg.messageId}
                    socket={socket}
                    message={msg}
                    isOwnMessage={msg.senderId === currentUserId}
                    currentUserId={currentUserId}
                    setReplyingTo={setReplyingTo}
                />
            ))}
            <div ref={messagesEndRef} />
            {showScrollToBottom && (
                <button
                    onClick={scrollToBottom}
                    className="absolute bottom-4 right-4 bg-primary text-primary-foreground rounded-full p-2 shadow-lg"
                >
                    <ChevronDown size={24} />
                </button>
            )}
        </div>
    );
};

export default MessageList;
