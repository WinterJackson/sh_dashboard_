// src/lib/data-access/messaging/data.ts

"use server";

import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Conversation, Message, MessageType, Role } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

/**
 * Fetch conversations for the logged-in user
 */
export async function fetchConversations(userId: string): Promise<Conversation[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        console.error("Unauthorized access to fetchConversations.");
        return [];
    }

    try {
        // Validate the user's role
        const userRole = session.user.role as Role;
        if (userRole !== "SUPER_ADMIN" && !session.user.hospitalId) {
            console.error("User must have an associated hospital ID.");
            return [];
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { userId: session.user.id },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            include: {
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        imageUrl: true,
                                        gender: true,
                                        phoneNo: true,
                                        cityOrTown: true,
                                        county: true,
                                    },
                                },
                            },
                        },
                    },
                },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        });

        return conversations;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching conversations:", errorMessage);
        return [];
    }
}

/**
 * Fetch messages in a given conversation
 */
export async function fetchMessages(conversationId: string, page: number = 1, limit: number = 20): Promise<Message[]> {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        console.error("Unauthorized access to fetchMessages.");
        return [];
    }

    try {
        // Validate the user's role
        const userRole = session.user.role as Role;
        if (userRole !== "SUPER_ADMIN" && !session.user.hospitalId) {
            console.error("User must have an associated hospital ID.");
            return [];
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: "desc" }, // desc to get the latest first for pagination
            skip: (page - 1) * limit,
            take: limit,
            include: {
                sender: {
                    include: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                imageUrl: true,
                                gender: true,
                                phoneNo: true,
                                cityOrTown: true,
                                county: true,
                            },
                        },
                    },
                },
                replyToMessage: { // also fetch the message being replied to
                    include: {
                        sender: {
                            select: {
                                username: true,
                            }
                        }
                    }
                }
            },
        });

        return messages.reverse(); // reverse to show oldest first
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching messages:", errorMessage);
        return [];
    }
}

/**
 * Send a new message in a conversation
 */
export async function sendMessage(
    conversationId: string,
    content: string,
    messageType: MessageType = MessageType.TEXT,
    replyToMessageId?: string,
    isUrgent?: boolean
): Promise<void> {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        console.error("Unauthorized access to sendMessage.");
        return;
    }

    try {
        const userRole = session.user.role as Role;
        if (userRole !== "SUPER_ADMIN" && !session.user.hospitalId) {
            console.error("User must have an associated hospital ID.");
            return;
        }

        await prisma.$transaction([
            prisma.message.create({
                data: {
                    conversationId,
                    senderId: session.user.id,
                    content,
                    messageType,
                    replyToMessageId,
                    isUrgent: isUrgent || false,
                },
            }),
            prisma.conversation.update({
                where: { conversationId },
                data: {
                    updatedAt: new Date(),
                    lastMessageAt: new Date(),
                },
            }),
        ]);

    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error sending message:", errorMessage);
    }
}
