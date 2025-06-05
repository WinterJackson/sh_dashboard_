// file: src/app/api/auth/reset-password/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";
import { AuditAction } from "@/lib/definitions";
import { sendEmail } from "@/lib/email";
import { updatePassword } from "@/lib/utils/updatePassword";

import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    let userId: string | null = null;
    let userEmail: string | null = null;

    try {
        const { token, newPassword } = await req.json();

        const ipAddress = anonymizeIP(getClientIP(req));
        const userAgent = req.headers.get("user-agent") || undefined;

        if (!token || !newPassword) {
            await prisma.auditLog.create({
                data: {
                    action: AuditAction.RESET_PASSWORD,
                    userId: null,
                    ipAddress,
                    userAgent,
                    status: "FAILED",
                    meta: {
                        reason: "Missing token or new password",
                        attemptedAt: new Date().toISOString(),
                    },
                },
            });

            return NextResponse.json(
                { error: "Token and new password are required" },
                { status: 400 }
            );
        }

        const incomingHashed = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await prisma.user.findFirst({
            where: {
                resetToken: incomingHashed,
                resetTokenExpiry: { gt: new Date() },
                hasCompletedOnboarding: false,
            },
        });

        if (!user) {
            await prisma.auditLog.create({
                data: {
                    action: AuditAction.RESET_PASSWORD,
                    userId: null,
                    ipAddress,
                    userAgent,
                    status: "FAILED",
                    meta: {
                        reason: "Invalid or expired token",
                        attemptedAt: new Date().toISOString(),
                    },
                },
            });

            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        userId = user.userId;
        userEmail = user.email;

        try {
            await updatePassword({
                userId,
                newPassword,
                reason: "reset",
                shouldRevokeSessions: true,
                req,
            });
        } catch (err: any) {
            // specifically handle reuse error message
            if (err.message === "Cannot reuse old password") {
                await prisma.auditLog.create({
                    data: {
                        action: AuditAction.RESET_PASSWORD,
                        userId,
                        ipAddress,
                        userAgent,
                        status: "FAILED",
                        meta: { reason: "Password reuse detected" },
                    },
                });
                return NextResponse.json(
                    {
                        error: "You cannot reuse a previous password. Please choose a new one.",
                    },
                    { status: 400 }
                );
            }
            throw err;
        }

        // 🔐 Invalidate token immediately after successful reset
        await prisma.user.update({
            where: { userId },
            data: {
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        await prisma.auditLog.create({
            data: {
                action: AuditAction.RESET_PASSWORD,
                userId,
                ipAddress,
                userAgent,
                status: "SUCCESS",
                meta: {
                    message: "Password reset completed",
                    timestamp: new Date().toISOString(),
                },
            },
        });

        if (userEmail) {
            try {
                await sendEmail({
                    to: userEmail,
                    subject: "Your Password Has Been Changed",
                    text: `Hello,\n\nYour password has been successfully changed.\n\nYou have been logged out from all devices.\n\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nThe SecureTeam`,
                    html: `<p>Hello,</p><p>Your password has been successfully changed.</p><p>You have been logged out from all devices.</p><p>If this wasn't you, please contact support immediately.</p><p>Best regards,<br/>SNARK HEALTH</p>`,
                });
            } catch (emailError) {
                await prisma.auditLog.create({
                    data: {
                        action: AuditAction.RESET_PASSWORD,
                        userId,
                        ipAddress,
                        userAgent,
                        status: "EMAIL_FAILED",
                        meta: {
                            reason: "Failed to send email",
                            error:
                                emailError instanceof Error
                                    ? emailError.message
                                    : String(emailError),
                        },
                    },
                });
            }
        }

        const response = NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );

        response.cookies.set("mfaVerified", "", {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
