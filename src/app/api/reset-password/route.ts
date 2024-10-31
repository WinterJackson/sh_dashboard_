// app/api/reset-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcrypt";

const prisma = require("@/lib/prisma");

export async function POST(req: NextRequest) {
    try {
        const { token, newPassword } = await req.json();

        // Find the user by the reset token and check if the token is still valid
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),  // Ensure the token has not expired
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await hash(newPassword, 10);

        // Update the user's password and remove the reset token
        await prisma.user.update({
            where: { userId: user.userId },
            data: {
                password: hashedPassword,
                resetToken: null,  // Clear the reset token
                resetTokenExpiry: null,  // Clear the token expiry
                needsPasswordChange: false,  // Mark the password change as complete
            },
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Error resetting password" }, { status: 500 });
    }
}