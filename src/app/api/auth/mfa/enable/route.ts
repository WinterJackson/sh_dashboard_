// src/app/api/auth/mfa/enable/route.ts

// Ensure API route runs in Node.js environment
export const runtime = 'nodejs';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { generateTOTPSecret } from "@/lib/totp";
import { NextRequest, NextResponse } from "next/server";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";
import { AuditAction } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";

import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    let userId: string | null = null;

    try {
        // 1. Get authenticated session
        const session = await getServerSession(authOptions);
        console.log("🔐 Session object:", session);

        // 2. Validate session
        if (!session?.user) {
            console.warn("Unauthorized access attempt to MFA enable");
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: userIdFromSession, email } = session.user;
        console.log("Enabling MFA for user:", userIdFromSession, email);
        
        // 3. Validate email
        if (!email) {
            console.error("No email in session for MFA enable");
            return NextResponse.json(
                { message: "Email is required to enable MFA" },
                { status: 400 }
            );
        }

        userId = userIdFromSession;

        // 4. Generate and encrypt TOTP secret + QR code
        const { encryptedSecret, iv, qrCodeDataUrl } = await generateTOTPSecret(email);
        console.log("generateTOTPSecret returned:", { encryptedSecret, iv, qrCodeDataUrlLength: qrCodeDataUrl.length });

        // 5. Persist encrypted secret and IV
        console.log("💾 Storing encrypted secret for userId:", userId);
        await prisma.user.update({
            where: { userId },
            data: {
                twoFactorEnabled: true,
                twoFactorSecret: encryptedSecret,
                twoFactorIV: iv,
            },
        });

        // 6. Audit log – success
        const ipAddress = anonymizeIP(getClientIP(req));
        const userAgent = req.headers.get("user-agent") ?? undefined;
        console.log("Logging MFA enable success for userId:", userId);

        await prisma.auditLog.create({
            data: {
                action: AuditAction.MFA_ENABLED,
                userId,
                ipAddress,
                userAgent,
                status: "SUCCESS",
                meta: {
                    method: "manual",
                    qrCodeGenerated: true,
                    timestamp: new Date().toISOString(),
                },
            },
        });

        // 7. Return the QR code data URL only
        console.log("Returning QR code data URL");
        return NextResponse.json({ qrCodeDataUrl });
    } catch (error) {
        // Audit log – failure
        console.error("Error during MFA enable:", error);
        const ipAddress = anonymizeIP(getClientIP(req));
        const userAgent = req.headers.get("user-agent") ?? undefined;

        await prisma.auditLog.create({
            data: {
                action: AuditAction.MFA_ENABLED,
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

        Sentry.captureException(error);
        return NextResponse.json(
            { message: "Failed to enable MFA" },
            { status: 500 }
        );
    }
}
