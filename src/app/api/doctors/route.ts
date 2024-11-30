// File: src/app/api/doctors/route.ts

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";
import { Prisma } from "@prisma/client";

const prisma = require("@/lib/prisma");

/**
 * GET: Retrieve the list of doctors.
 */
export async function GET(req: NextRequest) {
    try {
        const doctors = await prisma.doctor.findMany({
            include: {
                user: {
                    include: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                imageUrl: true,
                                gender: true,
                                dateOfBirth: true,
                                phoneNo: true,
                                address: true,
                                city: true,
                                state: true,
                                nextOfKin: true,
                                nextOfKinPhoneNo: true,
                                emergencyContact: true,
                            },
                        },
                    },
                },
                hospital: true,
                department: true,
                specialization: {
                    select: { name: true },
                },
                service: {
                    select: { serviceName: true },
                },
            },
        });

        return NextResponse.json(doctors, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST: Create a new doctor.
 */
export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as {
            firstName: string;
            lastName: string;
            email: string;
            gender: string;
            hospitalId: number;
            departmentId: number;
            specializationId: number;
            serviceId?: number;
            phoneNo: string;
            dateOfBirth: string;
            qualifications?: string;
            about?: string;
            status?: string;
            profileImageUrl?: string;
        };

        // Validate email
        if (!body.email || !body.email.includes("@")) {
            return NextResponse.json(
                { error: "Invalid email address provided" },
                { status: 400 }
            );
        }

        console.log("Received email:", body.email);

        // Validate foreign keys
        const [hospitalExists, departmentExists, specializationExists, serviceExists] =
            await prisma.$transaction([
                prisma.hospital.findUnique({
                    where: { hospitalId: body.hospitalId },
                    select: { hospitalId: true },
                }),
                prisma.department.findUnique({
                    where: { departmentId: body.departmentId },
                    select: { departmentId: true },
                }),
                prisma.specialization.findUnique({
                    where: { specializationId: body.specializationId },
                    select: { specializationId: true },
                }),
                prisma.service.findUnique({
                    where: { serviceId: body.serviceId || -1 },
                    select: { serviceId: true },
                }),
            ]);

        if (!hospitalExists || !departmentExists || !specializationExists) {
            return NextResponse.json(
                { error: "Invalid hospital, department, or specialization" },
                { status: 400 }
            );
        }

        if (body.serviceId && !serviceExists) {
            return NextResponse.json(
                { error: "Invalid service selected" },
                { status: 400 }
            );
        }

        let user = null;
        let doctor = null;
        let resetToken = null;

        // Transaction for user and doctor creation
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const existingUser = await tx.user.findUnique({
                where: { email: body.email },
            });

            if (!existingUser) {
                resetToken = crypto.randomBytes(32).toString("hex");
                const hashedToken = crypto
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");
                const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

                user = await tx.user.create({
                    data: {
                        username: `${body.firstName}_${body.lastName}`,
                        email: body.email,
                        password: await bcrypt.hash(body.firstName, 10),
                        role: "DOCTOR",
                        hospitalId: body.hospitalId,
                        mustResetPassword: true,
                        resetToken: hashedToken,
                        resetTokenExpiry: expiryDate,
                    },
                });

                await tx.profile.create({
                    data: {
                        userId: user.userId,
                        firstName: body.firstName,
                        lastName: body.lastName,
                        gender: body.gender || null,
                        phoneNo: body.phoneNo,
                        dateOfBirth: new Date(body.dateOfBirth),
                        imageUrl: body.profileImageUrl || null,
                    },
                });
            } else {
                user = existingUser;
            }

            doctor = await tx.doctor.create({
                data: {
                    userId: user.userId,
                    hospitalId: body.hospitalId,
                    departmentId: body.departmentId,
                    specializationId: body.specializationId,
                    serviceId: body.serviceId || undefined,
                    qualifications: body.qualifications || null,
                    about: body.about || null,
                    status: body.status || "Offline",
                    phoneNo: body.phoneNo,
                    workingHours: "Mon-Fri: 9AM-5PM",
                    averageRating: 0,
                },
            });
        });

        // Send reset email
        if (resetToken && user) {
            const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
            console.log("Sending reset email to:", body.email);

            await sendEmail({
                to: body.email,
                subject: "Set Your Password",
                text: `You have been added as a doctor. Click the link below to set your password. This link will expire in 1 hour: ${resetUrl}`,
                html: `<p>You have been added as a doctor. Click the link below to set your password. This link will expire in 1 hour:</p>
                       <a href="${resetUrl}">${resetUrl}</a>`,
            });
        }

        return NextResponse.json(doctor, { status: 201 });
    } catch (error: any) {
        console.error("Error creating doctor:", error);

        if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            return NextResponse.json(
                { error: "Duplicate email: Email address is already in use" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Failed to create doctor" },
            { status: 400 }
        );
    }
}