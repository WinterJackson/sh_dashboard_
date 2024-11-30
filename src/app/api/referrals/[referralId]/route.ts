// src/app/api/referrals/[referralId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { referralId: string } }
) {
    const { referralId } = params;

    try {
        const referral = await prisma.referral.findUnique({
            where: { referralId: parseInt(referralId) },
        });

        if (!referral) {
            return NextResponse.json({ error: "Referral not found" }, { status: 404 });
        }

        return NextResponse.json(referral, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch referral details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newReferral = await prisma.referral.create({
            data,
        });

        return NextResponse.json(newReferral, { status: 201 });
    } catch (error) {
        console.error("Failed to create referral:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { referralId: string } }
) {
    const { referralId } = params;

    try {
        const data = await req.json();
        const updatedReferral = await prisma.referral.update({
            where: { referralId: parseInt(referralId) },
            data,
        });

        if (!updatedReferral) {
            return NextResponse.json({ error: "Referral not found" }, { status: 404 });
        }

        return NextResponse.json(updatedReferral, { status: 200 });
    } catch (error) {
        console.error("Failed to update referral:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { referralId: string } }
) {
    const { referralId } = params;

    try {
        const deletedReferral = await prisma.referral.delete({
            where: { referralId: parseInt(referralId) },
        });

        if (!deletedReferral) {
            return NextResponse.json({ error: "Referral not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Referral deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete referral:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}