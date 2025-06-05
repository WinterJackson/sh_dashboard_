// src/app/api/auth/logout/route.ts

export const runtime = "nodejs";

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import * as Sentry from "@sentry/nextjs";
import { AuditAction } from "@/lib/definitions";

import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    let userId: string | null = null;
    try {
        // 1. Fetch session
        const session = await getServerSession(authOptions);
        console.log("Logout: session:", session);

        if (!session?.user?.id) {
            console.warn("Logout attempted without active session");
            return NextResponse.json(
                { error: "Unauthorized - No active session" },
                { status: 401 }
            );
        }

        userId = session.user.id;
        const userAgent = req.headers.get("user-agent") || "unknown";
        const ipAddress = req.headers.get("x-forwarded-for") || "unknown";

        // 2. Invalidate all user sessions
        console.log(`Logout: invalidating sessions for user ${userId}`);
        await prisma.session.deleteMany({ where: { userId } });

        // 3. Audit log success
        console.log(`Logout: logging audit for user ${userId}`);
        await prisma.auditLog.create({
            data: {
                action: AuditAction.LOGOUT,
                userId,
                ipAddress,
                userAgent,
                resourceType: "User",
                resourceId: userId,
                meta: {
                    method: req.method,
                    url: req.url,
                    signedOutAt: new Date().toISOString(),
                },
                status: "SUCCESS",
            },
        });

        // 4. Clear cookies
        console.log("Logout: clearing cookies");
        const cookieStore = cookies();
        const opts = {
            path: "/",
            httpOnly: true,
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
        };
        // Clear both secure and non‐secure NextAuth tokens
        cookieStore.set("__Secure-next-auth.session-token", "", opts);
        cookieStore.set("next-auth.session-token", "", opts);
        cookieStore.set("mfaVerified", "", opts);

        // 5. Redirect to sign-in
        console.log("Logout: redirecting to /sign-in");
        return NextResponse.redirect(new URL("/sign-in", req.url));
    } catch (error) {
        console.error("Logout: error during logout:", error);
        Sentry.captureException(error);

        // 6. Audit log failure
        try {
            console.log("Logout: logging failed audit");
            await prisma.auditLog.create({
                data: {
                    action: AuditAction.LOGOUT,
                    userId: userId ?? "unknown",
                    ipAddress: req.headers.get("x-forwarded-for") || "unknown",
                    userAgent: req.headers.get("user-agent") || undefined,
                    resourceType: "User",
                    resourceId: userId ?? "unknown",
                    meta: {
                        method: req.method,
                        url: req.url,
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    },
                    status: "FAILED",
                },
            });
        } catch (auditError) {
            console.error("Logout: failed to create audit log:", auditError);
        }

        return NextResponse.json(
            { error: "Internal server error during logout" },
            { status: 500 }
        );
    }
}
