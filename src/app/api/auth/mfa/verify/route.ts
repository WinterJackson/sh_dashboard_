// src/app/api/auth/mfa/verify/route.ts

// Ensure API route runs in Node.js environment
export const runtime = "nodejs";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { decryptTOTPSecret, verifyTOTP } from "@/lib/totp";
import { NextRequest, NextResponse } from "next/server";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";
import { AuditAction } from "@/lib/definitions";

import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    let userId: string | null = null;

    try {
        // 1. Get authenticated session
        const session = await getServerSession(authOptions);
        console.log("🔐 Session object for verify:", session);

        // 2. Validate session
        if (!session?.user) {
            console.warn("Unauthorized access attempt to MFA verify");
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: sessionUserId, email } = session.user;
        userId = sessionUserId;
        console.log("Verifying MFA for user:", userId, email);

        // 3. Validate email presence
        if (!email) {
            console.error("No email in session for MFA verify");
            return NextResponse.json(
                { message: "Email is required to verify MFA" },
                { status: 400 }
            );
        }

        // 4. Parse request body
        const { token } = await req.json();
        console.log("Received token for verification:", token);

        const ipAddress = anonymizeIP(getClientIP(req));
        const userAgent = req.headers.get("user-agent") ?? undefined;

        // 5. Validate token format (6 digits)
        if (!token || typeof token !== "string" || !/^\d{6}$/.test(token)) {
            console.error("Invalid token format:", token);
            await prisma.auditLog.create({
                data: {
                    action: AuditAction.MFA_VERIFIED,
                    userId,
                    ipAddress,
                    userAgent,
                    status: "FAILED",
                    meta: {
                        reason: "Invalid token format",
                        attemptedAt: new Date().toISOString(),
                    },
                },
            });
            return NextResponse.json(
                { message: "Token must be exactly 6 digits" },
                { status: 400 }
            );
        }

        // 6. Fetch encrypted secret and IV from DB
        const user = await prisma.user.findUnique({
            where: { userId },
            select: { twoFactorSecret: true, twoFactorIV: true },
        });
        console.log("Fetched user MFA data:", user);

        // 7. Ensure MFA was initialized
        if (!user?.twoFactorSecret || !user.twoFactorIV) {
            console.error("MFA not initialized for user:", userId);
            await prisma.auditLog.create({
                data: {
                    action: AuditAction.MFA_VERIFIED,
                    userId,
                    ipAddress,
                    userAgent,
                    status: "FAILED",
                    meta: {
                        reason: "2FA not initialized",
                        attemptedAt: new Date().toISOString(),
                    },
                },
            });
            return NextResponse.json(
                { message: "2FA not initialized" },
                { status: 400 }
            );
        }

        // 8. Decrypt secret and verify token
        const decryptedSecret = await decryptTOTPSecret(user.twoFactorSecret, user.twoFactorIV);
        console.log("Decrypted secret for verification:", decryptedSecret);
        const isValid = await verifyTOTP(token, decryptedSecret);
        console.log("Token validation result:", isValid);

        if (!isValid) {
            console.error("Invalid TOTP token for user:", userId);
            await prisma.auditLog.create({
                data: {
                    action: AuditAction.MFA_VERIFIED,
                    userId,
                    ipAddress,
                    userAgent,
                    status: "FAILED",
                    meta: {
                        reason: "Invalid TOTP token",
                        attemptedAt: new Date().toISOString(),
                    },
                },
            });
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        // 9. Set verification cookie
        const response = NextResponse.json({ verified: true });
        response.cookies.set("mfaVerified", "true", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 60, // 30 minutes
        });
        console.log("Set mfaVerified cookie for user:", userId);

        // 10. Audit log – success
        await prisma.auditLog.create({
            data: {
                action: AuditAction.MFA_VERIFIED,
                userId,
                ipAddress,
                userAgent,
                status: "SUCCESS",
                meta: {
                    verifiedAt: new Date().toISOString(),
                    method: "TOTP",
                },
            },
        });
        console.log("MFA verification success logged for user:", userId);

        return response;
    } catch (error) {
        console.error("Error during MFA verification:", error);
        const ipAddress = anonymizeIP(getClientIP(req));
        const userAgent = req.headers.get("user-agent") ?? undefined;
        await prisma.auditLog.create({
            data: {
                action: AuditAction.MFA_VERIFIED,
                userId,
                ipAddress,
                userAgent,
                status: "FAILED",
                meta: {
                    error: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                    attemptedAt: new Date().toISOString(),
                },
            },
        });
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
