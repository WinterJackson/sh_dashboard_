// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Role } from "../lib/definitions";
import * as Sentry from "@sentry/nextjs";

const prisma = require("@/lib/prisma");

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET environment variable is not set");
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Authorization started...");

                try {
                    if (!credentials?.email || !credentials.password) {
                        console.warn("Authorization failed: Missing email or password.");
                        return null; // Return null to indicate authorization failure
                    }

                    console.log("Credentials received. Attempting to find user...");

                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                        select: {
                            userId: true,
                            password: true,
                            username: true,
                            email: true,
                            role: true,
                            hospital: { select: { hospitalId: true, hospitalName: true } },
                        },
                    });

                    console.log("User fetched:", user);

                    if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                        console.warn("Authorization failed: Invalid email or password.");
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
        signOut: "/sign-out",
        error: "/error",
    },
    callbacks: {
        async session({ session, token }) {
            try {
                if (token) {
                    session.user = {
                        id: token.id as string,
                        username: token.username as string,
                        role: token.role as Role,
                        hospitalId: token.hospitalId as number | null,
                        hospital: token.hospital as string | null,
                    };
                }
                return session;
            } catch (error) {
                Sentry.captureException(error);
                console.error("Error in session callback:", error);
                return session;
            }
        },
        async jwt({ token, user }) {
            try {
                if (user) {
                    token.id = user.id;
                    token.username = user.username;
                    token.role = user.role as Role;
                    token.hospitalId = user.hospitalId as number | null;
                    token.hospital = user.hospital as string | null;

                    token.sessionToken = token.sessionToken || crypto.randomUUID();

                    const existingSession = await prisma.session.findUnique({
                        where: { sessionToken: token.sessionToken },
                    });

                    if (existingSession) {
                        await prisma.session.update({
                            where: { sessionToken: token.sessionToken },
                            data: { expires: new Date(Date.now() + 10 * 60 * 1000) },
                        });
                    } else {
                        await prisma.session.create({
                            data: {
                                sessionToken: token.sessionToken,
                                userId: user.id,
                                expires: new Date(Date.now() + 10 * 60 * 1000),
                            },
                        });
                    }
                }
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
