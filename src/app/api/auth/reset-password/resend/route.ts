// file: src/app/api/auth/reset-password/resend/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { AuditAction } from "@/lib/definitions";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";

import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const ipAddress = anonymizeIP(getClientIP(req));
    const userAgent = req.headers.get("user-agent") || undefined;
    let userId: string | null = null;
    let email: string | undefined;

    try {
        // accept either token or email in the body
        const body = await req.json();
        const token = body.token as string | undefined;
        email = body.email as string | undefined;

        // 1) If token was provided, try to find by existing resetToken
        if (token) {
            const hashed = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");
            const tokenUser = await prisma.user.findFirst({
                where: {
                    resetToken: hashed /*, hasCompletedOnboarding: false*/,
                },
            });
            if (tokenUser) {
                userId = tokenUser.userId;
                email = tokenUser.email!;
            }
        }

        // 2) If no user yet and we have an email, try to find by email
        if (!userId && email) {
            const emailUser = await prisma.user.findUnique({
                where: { email },
            });
            if (emailUser) {
                userId = emailUser.userId;
            }
        }

        // 3) If still no valid user, log & return 404
        if (!userId || !email) {
            await prisma.auditLog.create({
                data: {
                    action: AuditAction.RESET_PASSWORD,
                    userId: null,
                    ipAddress,
                    userAgent,
                    status: "FAILED",
                    meta: { reason: "User not found or missing email/token" },
                },
            });
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // 4) Generate a fresh token + expiry
        const newToken = crypto.randomBytes(32).toString("hex");
        const newHashed = crypto
            .createHash("sha256")
            .update(newToken)
            .digest("hex");

        await prisma.user.update({
            where: { userId },
            data: {
                resetToken: newHashed,
                resetTokenExpiry: new Date(Date.now() + 30 * 60 * 1000),
            },
        });

        // 5) Build the reset link and send the email
        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password/${newToken}`;
        await sendEmail({
            to: email,
            subject: "Your password reset link",
            text: `Click the link to reset your password: ${resetLink}`,
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
        });

        // 6) Audit success
        await prisma.auditLog.create({
            data: {
                action: AuditAction.RESET_PASSWORD,
                userId,
                ipAddress,
                userAgent,
                status: "SUCCESS",
                meta: { message: "Reset link resent" },
            },
        });

        return NextResponse.json(
            { message: "Reset link sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error resending reset link:", error);
        await prisma.auditLog.create({
            data: {
                action: AuditAction.RESET_PASSWORD,
                userId,
                ipAddress,
                userAgent,
                status: "ERROR",
                meta: { reason: "Unhandled exception", error: String(error) },
            },
        });
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
