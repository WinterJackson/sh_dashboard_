// src/lib/utils/updatePassword.ts

import bcrypt from "bcryptjs";
import { hash } from "bcrypt";
import { NextRequest } from "next/server";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";
import { AuditAction } from "@/lib/definitions";
import { sendEmail } from "../email";

import prisma from "@/lib/prisma";

// Max number of previous passwords to store
const MAX_PASSWORD_HISTORY = 5;

/**
 * Reusable password update logic
 */
export async function updatePassword({
    userId,
    newPassword,
    reason = "manual_change",
    shouldRevokeSessions = false,
    req,
}: {
    userId: string | null;
    newPassword: string;
    reason?: "manual_change" | "reset" | "recovery";
    shouldRevokeSessions?: boolean;
    req?: NextRequest;
}) {
    try {
        // Validate userId before proceeding
        if (!userId) {
            throw new Error("User ID is required to update password");
        }

        // Hash the new password
        const hashedNewPassword = await hash(newPassword, 12);

        // Check for password reuse
        const passwordHistory = await prisma.passwordHistory.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: MAX_PASSWORD_HISTORY,
        });

        const isPasswordReused = await Promise.all(
            passwordHistory.map(async (entry: { password: any }) => {
                return bcrypt.compare(newPassword, entry.password);
            })
        );

        console.log("Password history for user:", passwordHistory);
        console.log("Hashed new password:", hashedNewPassword);

        if (isPasswordReused.some((match) => match === true)) {
            console.log("REUSED PASSWORD DETECTED");

            console.log("Password history for user:", passwordHistory);
            console.log("Hashed new password:", hashedNewPassword);

            // ✉️ Send email warning about reuse attempt
            const user = await prisma.user.findUnique({ where: { userId } });

            if (user?.email) {
                try {
                    await sendEmail({
                        to: user.email,
                        subject: "⚠️ Password Reuse Detected",
                        text: `Hello,\n\nWe noticed an attempt to reuse an old password.\n\nYour account security policy prevents using passwords that were used recently.\n\nIf this was not you, please contact support immediately.\n\nBest regards,\nThe SecureTeam`,
                        html: `<p>Hello,</p>
                            <p>We noticed an attempt to reuse an old password.</p>
                            <p>Your account security policy prevents using passwords that were used recently.</p>
                            <p>If this wasn't you, please contact support immediately.</p>
                            <p>Best regards,<br/>SNARK HEALTH</p>`,
                    });
                } catch (emailError) {
                    console.error("Failed to send reuse email:", emailError);
                }
            }

            // 🧾 Log reuse attempt
            if (req) {
                const ipAddress = anonymizeIP(getClientIP(req));
                const userAgent = req.headers.get("user-agent") || undefined;

                await prisma.auditLog.create({
                    data: {
                        action: AuditAction.RESET_PASSWORD,
                        userId,
                        ipAddress,
                        userAgent,
                        status: "REUSE_ATTEMPT",
                        meta: {
                            reason: "Attempted to reuse old password",
                            attemptedAt: new Date().toISOString(),
                        },
                    },
                });
            } else {
                // Fallback logging without IP/User-Agent
                await prisma.auditLog.create({
                    data: {
                        action: AuditAction.RESET_PASSWORD,
                        userId,
                        status: "REUSE_ATTEMPT",
                        meta: {
                            reason: "Attempted to reuse old password",
                            attemptedAt: new Date().toISOString(),
                        },
                    },
                });
            }

            // ❌ Reject password reuse
            throw new Error("Cannot reuse old password");
        }

        // Revoke sessions if needed
        if (shouldRevokeSessions) {
            await prisma.session.deleteMany({ where: { userId } });
        }

        // Update user password + optional fields
        const updatedUser = await prisma.user.update({
            where: { userId },
            data: {
                password: hashedNewPassword,
                ...(reason === "reset" && {
                    resetToken: null,
                    resetTokenExpiry: null,
                    mustResetPassword: false,
                }),
            },
        });

        // Store new password in history
        await prisma.passwordHistory.create({
            data: {
                userId,
                password: hashedNewPassword,
            },
        });

        // Clean up old entries beyond limit
        if (passwordHistory.length >= MAX_PASSWORD_HISTORY) {
            const oldestEntry = passwordHistory[MAX_PASSWORD_HISTORY - 1];
            await prisma.passwordHistory.deleteMany({
                where: {
                    userId,
                    createdAt: { lt: oldestEntry.createdAt },
                },
            });
        }

        // Log success
        if (req) {
            const ipAddress = anonymizeIP(getClientIP(req));
            const userAgent = req.headers.get("user-agent") || undefined;

            await prisma.auditLog.create({
                data: {
                    action: AuditAction.RESET_PASSWORD,
                    userId,
                    ipAddress,
                    userAgent,
                    status: "SUCCESS",
                    meta: {
                        method:
                            reason === "reset"
                                ? "email-token"
                                : "manual_change",
                        revokedSessions: shouldRevokeSessions,
                        timestamp: new Date().toISOString(),
                    },
                },
            });
        }

        return updatedUser;
    } catch (error) {
        // Log failure
        if (req) {
            const ipAddress = anonymizeIP(getClientIP(req));
            const userAgent = req.headers.get("user-agent") || undefined;

            await prisma.auditLog.create({
                data: {
                    action: AuditAction.RESET_PASSWORD,
                    userId: userId ?? null,
                    ipAddress,
                    userAgent,
                    status: "FAILED",
                    meta: {
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                        stack: error instanceof Error ? error.stack : undefined,
                        attemptedAt: new Date().toISOString(),
                    },
                },
            });
        }

        throw error;
    }
}