// src/app/api/profile/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

/**
 * GET user profile by userId.
 */
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const userId = params.userId;

    try {
        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: {
                profileId: true,
                firstName: true,
                lastName: true,
                gender: true,
                phoneNo: true,
                address: true,
                dateOfBirth: true,
                imageUrl: true,
                nextOfKin: true,
                nextOfKinPhoneNo: true,
                emergencyContact: true,
            },
        });

        if (!profile) {
            return NextResponse.json({ message: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}