// src/app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
const prisma = require("@/lib/prisma");
import { hash } from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const { username, email, password, role, hospitalId } =
            await req.json();

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

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error("Error adding user:", error);
        return NextResponse.json(
            { error: "Error adding user" },
            { status: 500 }
        );
    }
}

// Add PUT, DELETE and GET methods similarly
