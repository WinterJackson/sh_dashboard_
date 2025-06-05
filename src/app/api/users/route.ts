// src/app/api/users/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { username, email, role, hospitalId } = await req.json();

        // Step 1: Generate a secure random password reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // Token expires in 1 hour

        // Step 2: Create a new user without a password
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                role,
                hospitalId,
                resetToken,  // Store the reset token
                resetTokenExpiry,  // Token expiration time
                needsPasswordChange: true,  // Flag for password reset
            },
        });

        // Step 3: Send an email to the doctor with a password reset link
        const resetLink = `https://snarkhealth.com/reset-password?token=${resetToken}`;
        await sendEmail({
            to: email,
            subject: "Set Your Password",
            text: `Dear ${username},\n\nPlease set your password by clicking on the following link:\n${resetLink}\n\nThis link will expire in 1 hour.\n\nThank you!`,
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error adding user:", error);
        return NextResponse.json({ error: "Error adding user" }, { status: 500 });
    }
}
