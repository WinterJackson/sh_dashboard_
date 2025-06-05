// src/lib/authOptions.ts

import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Role, AuditAction } from "../lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";
import { sendEmail } from "./email";

import prisma from "@/lib/prisma";

// session lifetime
export const SESSION_TTL = 30 * 60; // 30 minutes

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET environment variable is not set");
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: SESSION_TTL,
        updateAge: 5 * 60,
    },
    cookies: {
        sessionToken: {
            name: "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax" as const,
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                console.log("Authorization started...");
                try {
                    // Validate credentials presence
                    if (!credentials?.email || !credentials.password) {
                        console.warn(
                            "Missing email or password for authorization"
                        );
                        return null;
                    }

                    // Extract client IP and anonymize for logging
                    const rawIP = getClientIP(req as any);
                    const ipAddress = anonymizeIP(rawIP);

                    // Safely extract user-agent
                    const userAgent =
                        typeof req.headers === "object" && req.headers?.get
                            ? (req.headers.get("user-agent") as string)
                            : "unknown";

                    console.log(
                        "Credentials received. Attempting to find user..."
                    );

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        select: {
                            userId: true,
                            password: true,
                            username: true,
                            email: true,
                            role: true,
                            hospital: {
                                select: {
                                    hospitalId: true,
                                    hospitalName: true,
                                },
                            },
                            isActive: true,
                            twoFactorEnabled: true,
                            mustResetPassword: true,
                            hasCompletedOnboarding: true,
                        },
                    });

                    console.log("User fetched:", user);

                    if (
                        !user ||
                        !(await bcrypt.compare(
                            credentials.password,
                            user.password
                        ))
                    ) {
                        console.warn(
                            "Authorization failed: Invalid email or password."
                        );

                        // Log failed attempt
                        await prisma.auditLog.create({
                            data: {
                                action: AuditAction.LOGIN,
                                userId: user?.userId ?? null,
                                ipAddress,
                                userAgent,
                                status: "FAILED",
                                meta: { reason: "Invalid credentials" },
                            },
                        });
                        return null;
                    }

                    if (!user.isActive) {
                        console.warn(
                            "Inactive user attempted login:",
                            user.email
                        );
                        return null;
                    }

                    // Block login if password must be reset
                    if (user.mustResetPassword) {
                        console.warn(
                            "User must reset password before accessing the system"
                        );
                        throw new Error("Password reset required");
                    }

                    // Log successful login
                    await prisma.auditLog.create({
                        data: {
                            action: AuditAction.LOGIN,
                            userId: user.userId,
                            ipAddress,
                            userAgent,
                            status: "SUCCESS",
                            meta: { method: "email-password" },
                        },
                    });

                    // Password Reuse Detection on Login
                    const MAX_PASSWORD_HISTORY = 5;
                    const passwordHistory =
                        await prisma.passwordHistory.findMany({
                            where: { userId: user.userId },
                            orderBy: { createdAt: "desc" },
                            take: MAX_PASSWORD_HISTORY,
                        });

                    const isPasswordReused = await Promise.all(
                        passwordHistory.map(
                            async (entry: { password: string }) => {
                                if (entry.password === user.password)
                                    return false;
                                return await bcrypt.compare(
                                    credentials.password,
                                    entry.password
                                );
                            }
                        )
                    );

                    if (isPasswordReused.some((match) => match)) {
                        console.warn("Login blocked due to reused password");

                        // Send email notification
                        try {
                            await sendEmail({
                                to: user.email,
                                subject:
                                    "⚠️ Password Reuse Detected During Login",
                                text: `Hello,\n\nWe detected a login attempt using an old password.\n\nFor security reasons, we recommend changing your password regularly.\n\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nThe SecureTeam`,
                                html: `<p>Hello,</p>
                                    <p>We detected a login attempt using an old password.</p>
                                    <p>For security reasons, we recommend changing your password regularly.</p>
                                    <p>If this wasn't you, please contact support immediately.</p>
                                    <p>Best regards,<br/>The SecureTeam</p>`,
                            });
                        } catch (emailError) {
                            console.error(
                                "Failed to send reuse detection email:",
                                emailError
                            );
                        }

                        await prisma.auditLog.create({
                            data: {
                                action: AuditAction.LOGIN,
                                userId: user.userId,
                                ipAddress,
                                userAgent,
                                status: "REUSE_ATTEMPT",
                                meta: {
                                    reason: "Used a recently changed password",
                                    attemptedAt: new Date().toISOString(),
                                },
                            },
                        });

                        return null;
                    }

                    console.log("User authenticated successfully.");

                    return {
                        id: user.userId,
                        username: user.username,
                        email: user.email,
                        role: user.role as Role,
                        hospitalId: user.hospital?.hospitalId || null,
                        hospital: user.hospital?.hospitalName || null,
                        isActive: user.isActive,
                        twoFactorEnabled: user.twoFactorEnabled ?? false,
                        mfaVerified: false,
                        hasCompletedOnboarding:
                            user.hasCompletedOnboarding ?? false,
                    };
                } catch (error) {
                    console.error("Error during authentication:", error);
                    Sentry.captureException(error);
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/sign-in",
        signOut: "/api/auth/logout",
        error: "/error",
    },
    callbacks: {
        async signIn({ user }: { user: User }) {
            if (!user.isActive) {
                console.warn(
                    "Blocked inactive user from signing in:",
                    user.email
                );
                return false;
            }
            return true;
        },

        async session({ session, token }) {
            try {
                if (token) {
                    const cookieStore = cookies();
                    const mfaVerified =
                        cookieStore.get("mfaVerified")?.value === "true";

                    session.user = {
                        id: token.id as string,
                        email: token.email as string,
                        username: token.username as string,
                        role: token.role as Role,
                        hospitalId: token.hospitalId as number | null,
                        hospital: token.hospital as string | null,
                        isActive: token.isActive as boolean,
                        twoFactorEnabled: token.twoFactorEnabled as boolean,
                        mfaVerified,
                        hasCompletedOnboarding:
                            token.hasCompletedOnboarding as boolean,
                    };
                }
                return session;
            } catch (error) {
                Sentry.captureException(error);
                console.error("Error in session callback:", error);
                return session;
            }
        },

        async jwt({ token, user, trigger }) {
            try {
                // Initial sign-in: populate token with user props
                if (user) {
                    token.id = user.id;
                    token.email = user.email;
                    token.username = user.username;
                    token.role = user.role as Role;
                    token.hospitalId = user.hospitalId as number | null;
                    token.hospital = user.hospital as string | null;
                    token.isActive = user.isActive;
                    token.twoFactorEnabled = user.twoFactorEnabled ?? false;
                    token.mfaVerified = false;
                    token.hasCompletedOnboarding =
                        user.hasCompletedOnboarding ?? false;
                }

                // On session update trigger, refresh specific flags
                if (trigger === "update") {
                    const freshUser = await prisma.user.findUnique({
                        where: { userId: token.sub },
                        select: {
                            hasCompletedOnboarding: true,
                            isActive: true,
                            twoFactorEnabled: true,
                        },
                    });
                    if (freshUser) {
                        token.hasCompletedOnboarding =
                            freshUser.hasCompletedOnboarding;
                        token.isActive = freshUser.isActive;
                        token.twoFactorEnabled = freshUser.twoFactorEnabled;
                    }
                }

                // upsert to create or update session
                if (!token.sessionToken) {
                    token.sessionToken = crypto.randomUUID();
                }

                const dbExpiry = new Date(Date.now() + SESSION_TTL * 1000);

                await prisma.session.upsert({
                    where: { sessionToken: token.sessionToken },
                    update: { expires: dbExpiry },
                    create: {
                        sessionToken: token.sessionToken,
                        userId: token.sub!,
                        expires: dbExpiry,
                    },
                });

                // Ensure onboarding flag always defined
                token.hasCompletedOnboarding =
                    token.hasCompletedOnboarding ?? false;

                return token;
            } catch (error) {
                Sentry.captureException(error);
                console.error("Error in JWT callback:", error);
                return token;
            }
        },
    },
    events: {
        async signOut({ token }) {
            try {
                // Clear mfaVerified cookie
                const cookieHeader =
                    "mfaVerified=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax";
                if (typeof globalThis.Response !== "undefined") {
                    const res = new globalThis.Response();
                    res.headers.set("Set-Cookie", cookieHeader);
                }

                // Delete session record
                if (token.sessionToken) {
                    await prisma.session.deleteMany({
                        where: { sessionToken: token.sessionToken },
                    });
                }
            } catch (error) {
                Sentry.captureException(error);
                console.error("Error during sign-out:", error);
            }
        },
    },
};
