// File: src/app/api/hospitals/[hospitalId]/route.ts

import { NextRequest, NextResponse } from "next/server";

const prisma = require("@/lib/prisma");

/**
 * Handle GET requests to fetch a hospital by ID.
 */
export async function GET(
    req: Request,
    { params }: { params: { hospitalId: string } }
) {
    const { hospitalId } = params;

    try {
        const hospital = await prisma.hospital.findUnique({
            where: { hospitalId: parseInt(hospitalId) },
        });

        if (!hospital) {
            return NextResponse.json(
                { error: "Hospital not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(hospital, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch hospital details:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

/**
 * Handle POST requests to create a new hospital.
 */
export async function POST(req: Request) {
    const body = await req.json();
    const { name, address } = body;

    try {
        const newHospital = await prisma.hospital.create({
            data: { name, address },
        });
        return NextResponse.json(newHospital, { status: 201 });
    } catch (error) {
        console.error("Error adding hospital:", error);
        return NextResponse.json(
            { error: "Error adding hospital" },
            { status: 500 }
        );
    }
}

/**
 * Handle PUT requests to update an existing hospital.
 */
export async function PUT(
    req: Request,
    { params }: { params: { hospitalId: string } }
) {
    const { hospitalId } = params;
    const body = await req.json();

    try {
        const updatedHospital = await prisma.hospital.update({
            where: { hospitalId: parseInt(hospitalId) },
            data: body,
        });
        return NextResponse.json(updatedHospital, { status: 200 });
    } catch (error) {
        console.error("Error updating hospital:", error);
        return NextResponse.json(
            { error: "Error updating hospital" },
            { status: 500 }
        );
    }
}

/**
 * Handle DELETE requests to remove a hospital by ID.
 */
export async function DELETE(
    req: Request,
    { params }: { params: { hospitalId: string } }
) {
    const { hospitalId } = params;

    try {
        await prisma.hospital.delete({
            where: { hospitalId: parseInt(hospitalId) },
        });
        return NextResponse.json(
            { message: "Hospital deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting hospital:", error);
        return NextResponse.json(
            { error: "Error deleting hospital" },
            { status: 500 }
        );
    }
}