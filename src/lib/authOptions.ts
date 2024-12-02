// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Role } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 10 * 60, // 10 minutes
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Please provide both email and password.");
                }

                // Fetch the user
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        userId: true,
                        password: true,
                        username: true,
                        email: true,
                        role: true,
                        hospital: { select: { hospitalId: true, name: true } },
                    },
                });

                if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                    throw new Error("Invalid email or password.");
                }

                return {
                    id: user.userId,
                    username: user.username,
                    email: user.email,
                    role: user.role as Role,
                    hospitalId: user.hospital?.hospitalId || null,
                    hospital: user.hospital?.name || null,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/sign-in",
        signOut: "/sign-out",
        error: "/error",
        verifyRequest: "/verify-request",
        newUser: "/welcome",
    },
    callbacks: {
        async session({ session, token }) {
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
        },
        async jwt({ token, user }) {
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
        },
    },
    events: {
        async signOut({ token }) {
            if (token.sessionToken) {
                await prisma.session.deleteMany({
                    where: { sessionToken: token.sessionToken },
                });
            }
        },
    },
};
