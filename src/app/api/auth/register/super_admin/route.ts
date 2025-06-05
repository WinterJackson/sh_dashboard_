// File: src/app/api/auth/register/super_admin/route.ts

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Role, AuditAction } from "@/lib/definitions";
import { getServerSession } from "next-auth";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session || session.user?.role !== Role.SUPER_ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { email, username } = await req.json();

    const exists = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
    });
    if (exists)
        return NextResponse.json(
            { message: "User already exists" },
            { status: 409 }
        );

    const tempPassword = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            mustResetPassword: true,
            superAdmin: { create: {} },
        },
    });

    const rawToken = crypto.randomUUID();
    const hashedToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
        where: { userId: user.userId },
        data: { resetToken: hashedToken, resetTokenExpiry },
    });

    const ipAddress = anonymizeIP(getClientIP(req));
    const userAgent = req.headers.get("user-agent") || undefined;

    await prisma.auditLog.create({
        data: {
            action: AuditAction.RESET_PASSWORD,
            userId: user.userId,
            ipAddress,
            userAgent,
            status: "TOKEN_ISSUED",
            meta: {
                reason: "Super admin creation triggers reset",
                issuedAt: new Date().toISOString(),
            },
        },
    });

    await sendEmail({
        to: email,
        subject: "Set your password",
        text: `Please set your password using this link: ${process.env.BASE_URL}/reset-password/${rawToken}.\n\n Your PASSWORD RESET TOKEN is,\n\n ${rawToken}.`,
    });

    return NextResponse.json({ message: "Super admin created. Email sent." });
}
