// src/lib/authOptions.ts

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Validate the credentials
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Please enter your email and password");
                }

                // Fetch the user from the database
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    include: { role: true, hospital: true },
                });

                // If no user was found or passwords do not match
                if (
                    !user ||
                    !(await bcrypt.compare(credentials.password, user.password))
                ) {
                    throw new Error("Invalid email or password");
                }

                // Return the user object if authentication was successful
                return {
                    id: user.userId,
                    username: user.username,
                    email: user.email,
                    role: user.role?.roleName,
                    hospital: user.hospital?.name,
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
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.role = token.role as string;
                session.user.hospital = token.hospital as string;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role;
                token.hospital = user.hospital;
                token.sessionToken = crypto.randomUUID();
                // Store session in the database
                await prisma.session.create({
                    data: {
                        sessionToken: token.sessionToken,
                        userId: user.id,
                        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
                    },
                });
            }

            return token;
        },
    },
    events: {
        async signOut({ token }) {
            // Invalidate the session on sign out
            await prisma.session.deleteMany({
                where: {
                    sessionToken: token.sessionToken,
                },
            });
        },
    },
};
