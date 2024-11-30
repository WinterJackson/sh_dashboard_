// src/app/api/reset-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";
import crypto from "crypto";

const prisma = require("@/lib/prisma");

export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json();

        // Validate input
        if (!token || !newPassword) {
            return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
        }

        // Hash incoming token to match stored hashed token
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        // Find user by hashed reset token and check if token is valid
        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: {
                    gt: new Date(), // Ensure token is not expired
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 10);

        // Update user's password, clear reset token
        await prisma.user.update({
            where: { userId: user.userId },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                mustResetPassword: false,
            },
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Error resetting password" }, { status: 500 });
    }
}
