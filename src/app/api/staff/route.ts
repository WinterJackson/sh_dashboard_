// src/app/api/staff/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from "bcrypt";

const prisma = require("@/lib/prisma");

export async function POST(req: NextRequest) {
    try {
        const {
            username,
            email,
            password,
            roleId,
            hospitalId
        } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStaff = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                roleId,
                hospitalId,
            },
        });

        return NextResponse.json(newStaff, { status: 201 });
    } catch (error) {
        console.error('Error adding staff:', error);
        return NextResponse.json({ error: 'Error adding staff' }, { status: 500 });
    }
}
