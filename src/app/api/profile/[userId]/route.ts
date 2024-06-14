// src/app/api/profile/[userId]/route.ts
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions";
import { NextRequest, NextResponse } from 'next/server';
const prisma = require("@/lib/prisma")


export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession({ req, ...authOptions });

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" });
        }

        const userId = session.user.id;

        console.log(userId)

        const profile = await prisma.profile.findUnique({
            where: { userId },
            select: {
                profileId: true,
                firstName: true,
                lastName: true,
                gender: true,
                phone: true,
                address: true,
                dateOfBirth: true,
                imageUrl: true,
                nextOfKin: true,
                nextOfKinPhoneNo: true,
                emergencyContact: true,
            },
        });

        console.log(profile)

        if (!profile) {
            return NextResponse.json({ message: "Profile not found" });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        NextResponse.json({ message: 'Internal server error' });
    }
}