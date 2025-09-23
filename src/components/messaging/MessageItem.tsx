// src/components/messaging/MessageItem.tsx

"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Message, MessageType } from "@/lib/definitions";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    Check,
    CheckCheck,
    CornerUpLeft,
    Edit,
    File as FileIcon,
    MoreVertical,
    Smile,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import LinkPreview from "./ui/LinkPreview";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

interface MessageItemProps {
    socket: Socket | null;
    message: Message;
    isOwnMessage: boolean;
    currentUserId: string;
    setReplyingTo: (message: Message | null) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
    socket,
    message,
    isOwnMessage,
    currentUserId,
    setReplyingTo,
}) => {
    const messageRef = useRef<HTMLDivElement>(null);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);

    useEffect(() => {
        if (!socket) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (
                    entry.isIntersecting &&
                    !isOwnMessage &&
                    !message.readReceipts?.some(
                        (r) => r.userId === currentUserId
                    )
                ) {
                    socket.emit("message-read", {
                        conversationId: message.conversationId,
                        messageId: message.messageId,
                        userId: currentUserId,
                    });
                }
            },
            { threshold: 1.0 }
        );

        if (messageRef.current) {
            observer.observe(messageRef.current);
        }

        return () => {
            if (messageRef.current) {
                observer.unobserve(messageRef.current);
            }
        };
    }, [message, isOwnMessage, currentUserId, socket]);

    const handleReaction = (reaction: string) => {
        if (!socket) return;

        socket.emit("react-to-message", {
            conversationId: message.conversationId,
            messageId: message.messageId,
            userId: currentUserId,
            reaction,
        });
        setShowReactionPicker(false);
    };

    const handleEdit = () => {
        if (!socket || !editedContent.trim()) return;
        socket.emit("edit-message", {
            messageId: message.messageId,
            newContent: editedContent,
            conversationId: message.conversationId,
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (!socket) return;
        // You might want a confirmation dialog here
        socket.emit("delete-message", {
            messageId: message.messageId,
            conversationId: message.conversationId,
        });
    };

    const getStatusIcon = () => {
        if (!isOwnMessage) return null;

        if (message.status === "sending") {
            return <Check size={16} />;
        }

        const isRead = message.readReceipts && message.readReceipts.length > 0;

        if (isRead) {
            return <CheckCheck size={16} className="text-blue-500" />;
        } else if (message.deliveredAt) {
            return <CheckCheck size={16} />;
        } else {
            return <Check size={16} />;
        }
    };

    const renderMessageContent = () => {
        if (isEditing) {
            return (
                <div className="flex flex-col gap-2">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-background text-foreground text-sm"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEdit}
                            className="text-xs font-bold"
                        >
                            Save
                        </button>
                    </div>
                </div>
            );
        }

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.content.match(urlRegex);

        switch (message.messageType) {
            case MessageType.IMAGE:
                return (
                    <Image
                        src={message.content}
                        alt="Image"
                        width={200}
                        height={200}
                        className="rounded-lg w-full h-auto"
                    />
                );
            case MessageType.VIDEO:
                return (
                    <video
                        controls
                        width="250"
                        className="rounded-lg w-full h-auto"
                    >
                        <source src={message.content} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                );
            case MessageType.AUDIO:
                return (
                    <audio controls src={message.content} className="w-full">
                        Your browser does not support the audio element.
                    </audio>
                );
            case MessageType.FILE:
                return (
                    <a
                        href={message.content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm"
                    >
                        <FileIcon size={20} className="mr-2" />
                        <span className="truncate">
                            {message.content.split("/").pop()}
                        </span>
                    </a>
                );
            default:
                return (
                    <div className="text-sm sm:text-base">
                        <p className="whitespace-pre-wrap break-words">
                            {message.content}
                        </p>
                        {urls &&
                            urls.map((url, index) => (
                                <LinkPreview key={index} url={url} />
                            ))}
                    </div>
                );
        }
    };

    const reactions = (message.reactions as Record<string, string[]>) || {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            ref={messageRef}
            className={`flex items-end group ${
                isOwnMessage ? "justify-end" : "justify-start"
            } mb-2 relative`}
        >
            <div
                className={`max-w-[80%] sm:max-w-xs md:max-w-md p-2 sm:p-3 rounded-lg ${
                    isOwnMessage
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                } ${message.isUrgent ? "border-2 border-destructive" : ""}`}
            >
                {message.isUrgent && (
                    <div className="flex items-center text-destructive mb-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="font-bold text-xs sm:text-sm">
                            Urgent
                        </span>
                    </div>
                )}
                {message.replyToMessage && (
                    <div className="border-l-2 border-border pl-2 mb-2 text-xs italic bg-black/20 p-2 rounded-md">
                        <p className="font-bold">
                            {message.replyToMessage.sender.username}
                        </p>
                        <p className="truncate">
                            {message.replyToMessage.content}
                        </p>
                    </div>
                )}
                {renderMessageContent()}
                <div className="flex items-center justify-end mt-1">
                    {message.editedAt && (
                        <span className="text-xs text-muted-foreground/80 mr-1">
                            (edited)
                        </span>
                    )}
                    <span className="text-xs text-muted-foreground/80 mr-1">
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                    {getStatusIcon()}
                </div>
                <div className="flex items-center justify-end mt-1">
                    {message.readReceipts?.map((receipt) => (
                        <Image
                            key={receipt.userId}
                            src={
                                receipt.user?.profile?.imageUrl ||
                                "/images/default-avatar.png"
                            }
                            alt={receipt.user?.username || "user"}
                            width={16}
                            height={16}
                            className="rounded-full ml-1"
                            title={`${receipt.user?.username} at ${new Date(
                                receipt.seenAt
                            ).toLocaleTimeString()}`}
                        />
                    ))}
                </div>
                {Object.keys(reactions).length > 0 && (
                    <div className="absolute -bottom-3 right-2 flex items-center bg-background rounded-full p-1 shadow">
                        {Object.entries(reactions).map(
                            ([reaction, userIds]) =>
                                userIds.length > 0 && (
                                    <button
                                        key={reaction}
                                        onClick={() =>
                                            setShowReactionPicker(true)
                                        }
                                        className="text-xs mr-1 cursor-pointer"
                                    >
                                        {reaction} {userIds.length}
                                    </button>
                                )
                        )}
                    </div>
                )}
            </div>
            <div className="relative flex flex-col">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-full hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={18} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onSelect={() => setReplyingTo(message)}
                        >
                            <CornerUpLeft size={18} className="mr-2" /> Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={() => setShowReactionPicker(true)}
                        >
                            <Smile size={18} className="mr-2" /> React
                        </DropdownMenuItem>
                        {isOwnMessage && (
                            <>
                                <DropdownMenuItem
                                    onSelect={() => setIsEditing(true)}
                                >
                                    <Edit size={18} className="mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onSelect={handleDelete}
                                    className="text-destructive"
                                >
                                    <Trash2 size={18} className="mr-2" /> Delete
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {showReactionPicker && (
                    <div className="absolute bottom-full mb-1 flex gap-1 bg-popover p-1 rounded-full shadow-lg">
                        {REACTIONS.map((reaction) => (
                            <button
                                key={reaction}
                                onClick={() => handleReaction(reaction)}
                                className="p-1 rounded-full hover:bg-accent"
                            >
                                {reaction}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default React.memo(MessageItem);
