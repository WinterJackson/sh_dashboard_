// src/app/api/users/[userId]/route.ts

export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const { userId } = params;

    try {
        const user = await prisma.user.findUnique({
            where: { userId },
            include: {
                superAdmin: true,
                admin: true,
                doctor: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                        department: true,
                        hospital: true,
                        service: true,
                        specialization: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                nurse: {
                    include: {
                        department: true,
                        hospital: true,
                    },
                },
                staff: {
                    include: {
                        department: true,
                        hospital: true,
                    },
                },
                profile: true,
                hospital: true,
            },
        });
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch user details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
