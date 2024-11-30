// src/app/api/payments/[paymentId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

export async function GET(
    req: NextRequest,
    { params }: { params: { paymentId: string } }
) {
    const { paymentId } = params;

    try {
        const payment = await prisma.payment.findUnique({
            where: { paymentId: parseInt(paymentId) },
        });

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(payment, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch payment details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newPayment = await prisma.payment.create({ data });

        return NextResponse.json(newPayment, { status: 201 });
    } catch (error) {
        console.error("Failed to create payment:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { paymentId: string } }
) {
    const { paymentId } = params;

    try {
        const data = await req.json();
        const updatedPayment = await prisma.payment.update({
            where: { paymentId: parseInt(paymentId) },
            data,
        });

        return NextResponse.json(updatedPayment, { status: 200 });
    } catch (error) {
        console.error("Failed to update payment:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { paymentId: string } }
) {
    const { paymentId } = params;

    try {
        await prisma.payment.delete({
            where: { paymentId: parseInt(paymentId) },
        });

        return NextResponse.json(
            { message: "Payment deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Failed to delete payment:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
