// File: src/app/api/auth/register/route.ts

export const runtime = "nodejs";

import { Role, AuditAction } from "@/lib/definitions";
import { NextResponse } from "next/server";
import * as z from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";

import prisma from "@/lib/prisma";

const userSchema = z.object({
    username: z.string().min(1).max(100),
    email: z.string().email(),
    role: z.nativeEnum(Role),
    hospitalId: z.number().nonnegative(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, role, hospitalId } = userSchema.parse(body);

        if (
            ![Role.DOCTOR, Role.NURSE, Role.STAFF, Role.PATIENT].includes(role)
        ) {
            return NextResponse.json(
                { message: "Only specific roles allowed" },
                { status: 400 }
            );
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingEmail)
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 409 }
            );

        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUsername)
            return NextResponse.json(
                { message: "Username already exists" },
                { status: 409 }
            );

        const tempPassword = crypto.randomUUID();
        const hashed = await bcrypt.hash(tempPassword, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashed,
                role,
                hospitalId,
                mustResetPassword: true,
            },
        });

        const rawToken = crypto.randomUUID();
        const hashedToken = crypto
            .createHash("sha256")
            .update(rawToken)
            .digest("hex");
        const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

        await prisma.user.update({
            where: { userId: newUser.userId },
            data: { resetToken: hashedToken, resetTokenExpiry },
        });

        const ipAddress = anonymizeIP(getClientIP(req));
        const userAgent = req.headers.get("user-agent") || undefined;

        await prisma.auditLog.create({
            data: {
                action: AuditAction.RESET_PASSWORD,
                userId: newUser.userId,
                ipAddress,
                userAgent,
                status: "TOKEN_ISSUED",
                meta: {
                    reason: "New user registration requires password setup",
                    issuedAt: new Date().toISOString(),
                },
            },
        });

        await sendEmail({
            to: email,
            subject: "Set up your password",
            text: `Please set your password using this link: ${process.env.BASE_URL}/reset-password/${rawToken}.\n\n Your PASSWORD RESET TOKEN is,\n\n ${rawToken}.`,
        });

        const { password: _removed, ...rest } = newUser;
        return NextResponse.json(
            { user: rest, message: "User created. Email sent." },
            { status: 201 }
        );
    } catch (error) {
        console.error("User creation error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
