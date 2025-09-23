// socket-server.ts

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import prisma from "./src/lib/prisma";
import { decode } from "next-auth/jwt";
import cookie from "cookie";
import * as Sentry from "@sentry/node";

// Initialize Sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
});

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        credentials: true,
    },
});

interface AuthenticatedSocket extends Socket {
    user?: {
        id?: string;
        [key: string]: any;
    };
    lastActivity?: number;
    activityTimer?: NodeJS.Timeout;
}

// Authentication Middleware for Socket.IO
io.use(async (socket: AuthenticatedSocket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
        return next(new Error("Authentication error: No cookies provided."));
    }

    const cookies = cookie.parse(cookieHeader);
    const sessionToken =
        cookies["next-auth.session-token"] ||
        cookies["__Secure-next-auth.session-token"];

    if (!sessionToken) {
        return next(
            new Error("Authentication error: Session token not found.")
        );
    }

    try {
        const decoded = await decode({
            token: sessionToken,
            secret: process.env.NEXTAUTH_SECRET!,
        });

        if (!decoded) {
            return next(new Error("Authentication error: Invalid token."));
        }

        socket.user = decoded;
        next();
    } catch (err) {
        console.error("Token decoding error:", err);
        return next(
            new Error("Authentication error: Token verification failed.")
        );
    }
});

io.on("connection", (socket: AuthenticatedSocket) => {
    console.log("Socket connected:", socket.id);

    const resetActivityTimer = () => {
        if (socket.activityTimer) clearTimeout(socket.activityTimer);
        socket.activityTimer = setTimeout(() => {
            if (socket.user?.id) {
                socket.broadcast.emit("user-status-changed", {
                    userId: socket.user.id,
                    status: "away",
                });
            }
        }, 5 * 60 * 1000); // 5 minutes
    };

    socket.on("join-conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(
            `Socket ${socket.id} joined conversation ${conversationId}`
        );
    });

    socket.on("send-message", (message) => {
        resetActivityTimer();
        io.to(message.conversationId).emit("receive-message", message);
        console.log("Message sent to conversation:", message.conversationId);
    });

    socket.on("typing", ({ conversationId, isTyping }) => {
        resetActivityTimer();
        socket.to(conversationId).emit("typing", { isTyping });
    });

    // User Presence
    socket.on("user-online", (userId) => {
        resetActivityTimer();
        socket.broadcast.emit("user-status-changed", {
            userId,
            status: "online",
        });
    });

    socket.on("user-offline", (userId) => {
        if (socket.activityTimer) clearTimeout(socket.activityTimer);
        socket.broadcast.emit("user-status-changed", {
            userId,
            status: "offline",
        });
    });

    // Message Status
    socket.on(
        "message-delivered",
        async ({ conversationId, messageId, userId }) => {
            try {
                await prisma.message.update({
                    where: { messageId },
                    data: { deliveredAt: new Date() },
                });
                io.to(conversationId).emit("message-was-delivered", {
                    messageId,
                    userId,
                });
            } catch (error) {
                console.error(
                    "Error updating message delivered status:",
                    error
                );
            }
        }
    );

    socket.on("message-read", async ({ conversationId, messageId, userId }) => {
        try {
            const newReceipt = await prisma.readReceipt.create({
                data: {
                    messageId,
                    userId,
                },
                include: {
                    user: {
                        select: {
                            userId: true,
                            username: true,
                            profile: {
                                select: {
                                    imageUrl: true,
                                },
                            },
                        },
                    },
                },
            });
            io.to(conversationId).emit("message-seen", newReceipt);
        } catch (error: any) {
            if (error.code === "P2002") {
                // Ignore unique constraint violations
                return;
            }
            console.error("Error creating read receipt:", error);
            Sentry.captureException(error);
        }
    });

    socket.on(
        "react-to-message",
        async ({ conversationId, messageId, userId, reaction }) => {
            resetActivityTimer();
            try {
                const message = await prisma.message.findUnique({
                    where: { messageId },
                });

                if (message) {
                    const reactions =
                        (message.reactions as Record<string, string[]>) || {};
                    let userPreviousReaction = null;

                    // Find and remove user's previous reaction
                    for (const r in reactions) {
                        const userIndex = reactions[r].indexOf(userId);
                        if (userIndex > -1) {
                            userPreviousReaction = r;
                            reactions[r].splice(userIndex, 1);
                            if (reactions[r].length === 0) {
                                delete reactions[r];
                            }
                            break; // A user can only have one reaction
                        }
                    }

                    // If the new reaction is different from the previous one, add it
                    if (userPreviousReaction !== reaction) {
                        if (!reactions[reaction]) {
                            reactions[reaction] = [];
                        }
                        reactions[reaction].push(userId);
                    }

                    const updatedMessage = await prisma.message.update({
                        where: { messageId },
                        data: { reactions },
                    });

                    io.to(conversationId).emit(
                        "message-reacted",
                        updatedMessage
                    );
                }
            } catch (error) {
                console.error("Error reacting to message:", error);
            }
        }
    );

    socket.on(
        "edit-message",
        async ({ messageId, newContent, conversationId }) => {
            resetActivityTimer();
            try {
                const message = await prisma.message.findUnique({
                    where: { messageId },
                });

                if (message && message.senderId === socket.user?.id) {
                    const updatedMessage = await prisma.message.update({
                        where: { messageId },
                        data: { content: newContent, editedAt: new Date() },
                    });
                    io.to(conversationId).emit(
                        "message-edited",
                        updatedMessage
                    );
                }
            } catch (error) {
                console.error("Error editing message:", error);
            }
        }
    );

    socket.on("delete-message", async ({ messageId, conversationId }) => {
        resetActivityTimer();
        try {
            const message = await prisma.message.findUnique({
                where: { messageId },
            });

            if (
                message &&
                (message.senderId === socket.user?.id ||
                    ["ADMIN", "SUPER_ADMIN"].includes(socket.user?.role))
            ) {
                await prisma.message.delete({
                    where: { messageId },
                });
                io.to(conversationId).emit("message-deleted", { messageId });
            }
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    });

    // WebRTC Signaling
    socket.on("call-user", async (data) => {
        const fromUser = await prisma.user.findUnique({
            where: { userId: data.from },
            select: {
                username: true,
                profile: { select: { firstName: true, lastName: true } },
            },
        });
        const callerName = fromUser?.profile?.firstName
            ? `${fromUser.profile.firstName} ${fromUser.profile.lastName}`
            : fromUser?.username || "Unknown User";

        io.to(data.userToCall).emit("call-made", {
            signal: data.signalData,
            from: data.from,
            callerName: callerName,
        });
    });

    socket.on("accept-call", (data) => {
        io.to(data.to).emit("call-accepted", data.signal);
    });

    socket.on("end-call", (data) => {
        io.to(data.to).emit("call-ended");
    });

    socket.on("disconnect", () => {
        if (socket.activityTimer) clearTimeout(socket.activityTimer);
        if (socket.user?.id) {
            socket.broadcast.emit("user-status-changed", {
                userId: socket.user.id,
                status: "offline",
            });
        }
        console.log("Socket disconnected:", socket.id);
    });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`* Socket.IO server is running on port ${PORT}`);
});
