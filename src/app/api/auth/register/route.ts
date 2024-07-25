// app/api/auth/register/route.ts file

import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";
import { Role } from "@/lib/definitions";

const prisma = require ("@/lib/prisma")

// Define schema for input validation
const userSchema = z.object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required").min(8, "Password must have more than 8 characters"),
    role: z.nativeEnum(Role),
    hospitalId: z.number().nonnegative("Hospital is required"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, email, password, role, hospitalId } = userSchema.parse(body);

        // Check if email already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUserByEmail) {
            return NextResponse.json({ user: null, message: "User with this email already exists" }, { status: 409 });
        }

        // Check if username already exists
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUserByUsername) {
            return NextResponse.json({ user: null, message: "User with this username already exists" }, { status: 409 });
        }

        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                role,
                hospitalId,
            },
        });

        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
