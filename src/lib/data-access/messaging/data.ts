// src/lib/data-access/messaging/data.ts

"use server";

import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Conversation, Message, Role } from "@/lib/definitions";
import { revalidatePath } from "next/cache";

const prisma = require("@/lib/prisma");

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
export async function fetchMessages(conversationId: string): Promise<Message[]> {
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
            orderBy: { createdAt: "asc" },
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
            },
        });

        return messages;
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
export async function sendMessage(conversationId: string, content: string): Promise<void> {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        console.error("Unauthorized access to sendMessage.");
        return;
    }

    try {
        // Validate the user's role
        const userRole = session.user.role as Role;
        if (userRole !== "SUPER_ADMIN" && !session.user.hospitalId) {
            console.error("User must have an associated hospital ID.");
            return;
        }

        // Create the message
        await prisma.message.create({
            data: {
                conversationId,
                senderId: session.user.id,
                content,
            },
        });

        // Revalidate the messaging page after a new message is sent
        revalidatePath(`/messaging`);
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error sending message:", errorMessage);
    }
}
