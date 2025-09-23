// src/components/messaging/MessagingClient.tsx

"use client";

import ChatWindow from "@/components/messaging/ui/ChatWindow";
import ChatWindowSkeleton from "@/components/messaging/ui/ChatWindowSkeleton";
import ConversationDetailsModal from "@/components/messaging/ui/ConversationDetailsModal";
import ConversationList from "@/components/messaging/ui/ConversationList";
import ConversationListSkeleton from "@/components/messaging/ui/ConversationListSkeleton";
import { useSocket } from "@/components/providers/SocketProvider";
import { HospitalCombobox } from "@/components/ui/hospital-combobox";
import { useToast } from "@/components/ui/use-toast";
import { useFetchConversations } from "@/hooks/useFetchConversations";
import { useFetchHospitals } from "@/hooks/useFetchHospitals";
import { useFetchMessages } from "@/hooks/useFetchMessages";
import { useSendMessage } from "@/hooks/useSendMessage";
import {
    Conversation,
    Hospital,
    Message,
    MessageType,
    Role,
} from "@/lib/definitions";
import { useEdgeStore } from "@/lib/edgestore";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface MessagingClientProps {
    initialConversations: Conversation[];
    totalConversations: number;
    initialHospitals: Hospital[];
}

const MessagingClient = ({
    initialConversations,
    totalConversations,
    initialHospitals,
}: MessagingClientProps) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const socket = useSocket();
    const [selectedConversationId, setSelectedConversationId] = useState<
        string | null
    >(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const queryClient = useQueryClient();
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [isConversationListVisible, setIsConversationListVisible] =
        useState(true);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
        null
    );

    // Service Worker + Notifications
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log(
                        "Service Worker registered:",
                        registration.scope
                    );
                })
                .catch((err) => {
                    console.error("Service Worker registration failed:", err);
                });
        }

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []);

    // Redirect unauthenticated
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
    }, [status, router]);

    const userId = session?.user?.id;
    const userRole = session?.user?.role as Role;

    const { data: hospitals, isLoading: hospitalsLoading } = useFetchHospitals(
        userRole === Role.SUPER_ADMIN
            ? { role: userRole, hospitalId: null, userId: null }
            : undefined,
        { initialData: initialHospitals }
    );

    const {
        data: conversationsData,
        isLoading: conversationsLoading,
        fetchNextPage: fetchNextConversationsPage,
        hasNextPage: hasNextConversationsPage,
        isFetchingNextPage: isFetchingNextConversationsPage,
    } = useFetchConversations(
        userId || "",
        userRole,
        (userRole === Role.SUPER_ADMIN
            ? selectedHospitalId
            : session?.user?.hospitalId) || undefined,
        {
            initialData: {
                pages: [
                    { conversations: initialConversations, totalConversations },
                ],
                pageParams: [1],
            },
        }
    );

    const conversations =
        conversationsData?.pages.flatMap((page) => page.conversations) || [];

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: messagesLoading,
    } = useFetchMessages(selectedConversationId || "");

    const messages = data?.pages.flatMap((page) => page) || [];
    const sendMessageMutation = useSendMessage(
        userId || "",
        session?.user?.username || ""
    );

    // Socket listeners
    useEffect(() => {
        if (!socket || !userId) return;

        socket.emit("user-online", userId);

        const handleUserStatusChange = ({
            userId,
            status,
        }: {
            userId: string;
            status: "online" | "offline";
        }) => {
            setOnlineUsers((prev) =>
                status === "online"
                    ? [...new Set([...prev, userId])]
                    : prev.filter((id) => id !== userId)
            );
        };

        const handleTyping = () => {
            setIsTyping(true);
            if (typingTimeoutRef.current)
                clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(
                () => setIsTyping(false),
                2000
            );
        };

        socket.on("receive-message", (message: Message) => {
            queryClient.setQueryData(
                ["messages", message.conversationId],
                (oldData: any) => {
                    if (!oldData) {
                        return {
                            pages: [[message]],
                            pageParams: [1],
                        };
                    }

                    const newPages = [...oldData.pages];
                    const lastPageIndex = newPages.length - 1;
                    newPages[lastPageIndex] = [
                        ...newPages[lastPageIndex],
                        message,
                    ];

                    return {
                        ...oldData,
                        pages: newPages,
                    };
                }
            );
            socket.emit("message-delivered", {
                conversationId: message.conversationId,
                messageId: message.messageId,
                userId,
            });

            if (Notification.permission === "granted") {
                new Notification(
                    "New message from " + message.sender.username,
                    {
                        body: message.content,
                        icon:
                            message.sender.profile?.imageUrl ||
                            "/images/default-avatar.png",
                        badge: "/images/logo.png",
                        data: {
                            url: `/dashboard/messaging?conversationId=${message.conversationId}`,
                        },
                    }
                );
            }
        });

        socket.on("message-was-delivered", ({ conversationId, messageId }) => {
            queryClient.setQueryData(
                ["messages", conversationId],
                (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: Message[]) =>
                        page.map((m: Message) =>
                            m.messageId === messageId
                                ? { ...m, deliveredAt: new Date() }
                                : m
                        )
                    );
                    return { ...oldData, pages: newPages };
                }
            );
        });

        socket.on("message-seen", (newReceipt: any) => {
            queryClient.setQueryData(
                ["messages", newReceipt.conversationId],
                (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: Message[]) =>
                        page.map((m: Message) =>
                            m.messageId === newReceipt.messageId
                                ? {
                                      ...m,
                                      readReceipts: [
                                          ...(m.readReceipts || []),
                                          newReceipt,
                                      ],
                                  }
                                : m
                        )
                    );
                    return { ...oldData, pages: newPages };
                }
            );
        });

        socket.on("message-reacted", (updatedMessage: Message) => {
            queryClient.setQueryData(
                ["messages", updatedMessage.conversationId],
                (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: Message[]) =>
                        page.map((m: Message) =>
                            m.messageId === updatedMessage.messageId
                                ? updatedMessage
                                : m
                        )
                    );
                    return { ...oldData, pages: newPages };
                }
            );
        });

        socket.on("message-edited", (updatedMessage: Message) => {
            queryClient.setQueryData(
                ["messages", updatedMessage.conversationId],
                (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: Message[]) =>
                        page.map((m: Message) =>
                            m.messageId === updatedMessage.messageId
                                ? updatedMessage
                                : m
                        )
                    );
                    return { ...oldData, pages: newPages };
                }
            );
        });

        socket.on("message-deleted", ({ messageId, conversationId }) => {
            queryClient.setQueryData(
                ["messages", conversationId],
                (oldData: any) => {
                    if (!oldData) return oldData;
                    const newPages = oldData.pages.map((page: Message[]) =>
                        page.filter((m: Message) => m.messageId !== messageId)
                    );
                    return { ...oldData, pages: newPages };
                }
            );
        });

        socket.on("user-status-changed", handleUserStatusChange);
        socket.on("typing", handleTyping);

        return () => {
            socket.emit("user-offline", userId);
            if (typingTimeoutRef.current)
                clearTimeout(typingTimeoutRef.current);
            socket.off("receive-message");
            socket.off("message-was-delivered");
            socket.off("message-was-read");
            socket.off("message-reacted");
            socket.off("user-status-changed", handleUserStatusChange);
            socket.off("typing", handleTyping);
        };
    }, [socket, userId, queryClient]);

    const { toast } = useToast();
    const { edgestore } = useEdgeStore();

    const handleSendMessage = async (
        content: string,
        file?: File,
        isUrgent?: boolean
    ) => {
        if (!selectedConversationId) return;

        const messageData: {
            conversationId: string;
            content: string;
            messageType: MessageType;
            replyToMessageId?: string;
            isUrgent?: boolean;
            replyingTo?: Message | null;
        } = {
            conversationId: selectedConversationId,
            content,
            messageType: MessageType.TEXT,
            isUrgent: isUrgent || false,
        };

        if (replyingTo) {
            messageData.replyToMessageId = replyingTo.messageId;
            messageData.replyingTo = replyingTo;
        }

        if (file) {
            try {
                const res = await edgestore.publicFiles.upload({ file });
                const url = res.url;
                if (file.type.startsWith("image/")) {
                    messageData.messageType = MessageType.IMAGE;
                } else if (file.type.startsWith("video/")) {
                    messageData.messageType = MessageType.VIDEO;
                } else if (file.type.startsWith("audio/")) {
                    messageData.messageType = MessageType.AUDIO;
                } else {
                    messageData.messageType = MessageType.FILE;
                }
                messageData.content = url;
                sendMessageMutation.mutate(messageData);
            } catch (err) {
                console.error("Upload failed:", err);
                toast({
                    title: "Upload failed",
                    description: "Could not upload the file. Please try again.",
                    variant: "destructive",
                });
            }
        } else if (content.trim()) {
            sendMessageMutation.mutate(messageData);
        }

        setReplyingTo(null);
    };

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        if (info.offset.x > 100) {
            setIsConversationListVisible(true);
        } else if (info.offset.x < -100) {
            if (selectedConversationId) {
                setIsConversationListVisible(false);
            }
        }
    };

    const selectedConversation =
        conversations?.find(
            (c) => c.conversationId === selectedConversationId
        ) || null;

    if (conversationsLoading) {
        return (
            <div className="flex h-screen bg-background">
                <ConversationListSkeleton />
                <ChatWindowSkeleton />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop */}
            <div className="hidden md:flex md:flex-col md:w-80 h-full bg-slate-two">
                {userRole === Role.SUPER_ADMIN && (
                    <div className="p-4 border-b border-border mb-1">
                        <HospitalCombobox
                            hospitals={hospitals || []}
                            selectedHospitalId={selectedHospitalId}
                            onSelectHospitalId={setSelectedHospitalId}
                            isLoading={hospitalsLoading}
                            className="bg-slate"
                        />
                    </div>
                )}
                <div className="flex-1 overflow-y-auto scrollbar-custom">
                    <ConversationList
                        conversations={conversations || []}
                        selectedConversationId={selectedConversationId}
                        onSelectConversation={setSelectedConversationId}
                        userId={userId || ""}
                        onlineUsers={onlineUsers}
                        fetchNextPage={fetchNextConversationsPage}
                        hasNextPage={hasNextConversationsPage}
                        isFetchingNextPage={isFetchingNextConversationsPage}
                    />
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden w-full h-full relative overflow-hidden">
                <AnimatePresence>
                    {isConversationListVisible ? (
                        <motion.div
                            key="list"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDragEnd}
                        >
                            <div className="flex flex-col h-full">
                                {userRole === Role.SUPER_ADMIN && (
                                    <div className="p-4 border-b border-border">
                                        <HospitalCombobox
                                            hospitals={hospitals || []}
                                            selectedHospitalId={
                                                selectedHospitalId
                                            }
                                            onSelectHospitalId={
                                                setSelectedHospitalId
                                            }
                                            isLoading={hospitalsLoading}
                                            className="bg-slate"
                                        />
                                    </div>
                                )}
                                <div className="flex-1 overflow-y-auto scrollbar-custom">
                                    <ConversationList
                                        conversations={conversations || []}
                                        selectedConversationId={
                                            selectedConversationId
                                        }
                                        onSelectConversation={(id) => {
                                            setSelectedConversationId(id);
                                            setIsConversationListVisible(false);
                                        }}
                                        userId={userId || ""}
                                        onlineUsers={onlineUsers}
                                        fetchNextPage={
                                            fetchNextConversationsPage
                                        }
                                        hasNextPage={hasNextConversationsPage}
                                        isFetchingNextPage={
                                            isFetchingNextConversationsPage
                                        }
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col h-full"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={handleDragEnd}
                        >
                            {messagesLoading && !selectedConversationId ? (
                                <ChatWindowSkeleton />
                            ) : (
                                <ChatWindow
                                    socket={socket}
                                    selectedConversation={selectedConversation}
                                    userId={userId || ""}
                                    onSendMessage={handleSendMessage}
                                    onlineUsers={onlineUsers}
                                    isTyping={isTyping}
                                    replyingTo={replyingTo}
                                    setReplyingTo={setReplyingTo}
                                    messages={messages}
                                    fetchNextPage={fetchNextPage}
                                    hasNextPage={hasNextPage}
                                    isFetchingNextPage={isFetchingNextPage}
                                    onToggleInfoPanel={() =>
                                        setIsDetailsModalOpen(true)
                                    }
                                    onBack={() =>
                                        setIsConversationListVisible(true)
                                    }
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="hidden md:flex flex-1 flex-col h-full">
                {messagesLoading && !selectedConversationId ? (
                    <ChatWindowSkeleton />
                ) : (
                    <ChatWindow
                        socket={socket}
                        selectedConversation={selectedConversation}
                        userId={userId || ""}
                        onSendMessage={handleSendMessage}
                        onlineUsers={onlineUsers}
                        isTyping={isTyping}
                        replyingTo={replyingTo}
                        setReplyingTo={setReplyingTo}
                        messages={messages}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        onToggleInfoPanel={() => setIsDetailsModalOpen(true)}
                    />
                )}
            </div>
            <ConversationDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                conversation={selectedConversation}
                currentUserId={userId || ""}
            />
        </div>
    );
};

export default MessagingClient;
