// src/lib/data-access/conversations/data.ts

"use server";

import { Conversation, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import prisma from "@/lib/prisma";

export async function fetchConversations(
    userId: string,
    role: Role,
    hospitalId?: number,
    page: number = 1,
    limit: number = 20
): Promise<{ conversations: Conversation[]; totalConversations: number }> {
    try {
        let whereClause: any = {};

        switch (role) {
            case Role.SUPER_ADMIN:
                if (hospitalId) {
                    whereClause.hospitalId = hospitalId;
                }
                break;
            case Role.ADMIN:
                if (!hospitalId) {
                    throw new Error("Admin must be associated with a hospital.");
                }
                whereClause.hospitalId = hospitalId;
                break;
            case Role.DOCTOR:
            case Role.NURSE:
            case Role.STAFF:
            case Role.PATIENT:
                whereClause.participants = {
                    some: {
                        userId: userId,
                    },
                };
                break;
            default:
                throw new Error("Invalid user role.");
        }

        const skip = (page - 1) * limit;

        const [conversations, totalConversations] = await prisma.$transaction([
            prisma.conversation.findMany({
                where: whereClause,
                include: {
                    participants: {
                        include: {
                            user: {
                                select: {
                                    userId: true,
                                    username: true,
                                    role: true,
                                    patient: {
                                        select: {
                                            patientId: true,
                                        },
                                    },
                                    profile: {
                                        select: {
                                            firstName: true,
                                            lastName: true,
                                            imageUrl: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    messages: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1,
                    },
                },
                orderBy: {
                    lastMessageAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.conversation.count({ where: whereClause }),
        ]);

        return { conversations, totalConversations };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: {
                errorMessage,
                userId,
                role,
                hospitalId,
            },
        });
        console.error("Error fetching conversations:", errorMessage);
        return { conversations: [], totalConversations: 0 };
    }
}
