// src/app/api/doctors/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const prisma = require("@/lib/prisma");

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
                    select: {
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(doctors, { status: 200 });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const token = await getToken({ req });

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log("Received body:", body);

        const {
            bio,
            contactInformation,
            professionalInformation,
            about,
            selectedHospitalId,
            specializationId,
        } = body;

        // Validate required fields
        if (
            !bio?.firstName ||
            !bio?.lastName ||
            !bio?.gender ||
            !bio?.dateOfBirth ||
            !contactInformation?.phoneNumber ||
            !contactInformation?.city ||
            !contactInformation?.state ||
            !professionalInformation?.departmentId ||
            !specializationId ||
            !about
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let hospitalId: number;

        // Handle hospital selection based on role
        if (token.role === "SUPER_ADMIN") {
            if (!selectedHospitalId) {
                return NextResponse.json(
                    { error: "Hospital must be selected by Super Admin" },
                    { status: 400 }
                );
            }
            hospitalId = parseInt(selectedHospitalId, 10);
        } else if (token.role === "ADMIN") {
            if (!token.hospitalId) {
                return NextResponse.json(
                    { error: "Admin hospitalId is missing" },
                    { status: 400 }
                );
            }
            hospitalId = token.hospitalId;
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Ensure departmentId and specializationId are integers
        const departmentId = parseInt(professionalInformation.departmentId, 10);
        const parsedSpecializationId = parseInt(specializationId, 10);

        if (isNaN(departmentId) || isNaN(parsedSpecializationId)) {
            return NextResponse.json(
                { error: "Invalid department or specialization ID" },
                { status: 400 }
            );
        }

        // Transaction to create both user and doctor
        const result = await prisma.$transaction(async () => {
            const user = await prisma.user.create({
                data: {
                    role: "DOCTOR",
                    profile: {
                        create: {
                            firstName: bio.firstName,
                            lastName: bio.lastName,
                            gender: bio.gender,
                            dateOfBirth: new Date(bio.dateOfBirth),
                            phoneNo: contactInformation.phoneNumber,
                            city: contactInformation.city,
                            state: contactInformation.state,
                            imageUrl: "",
                        },
                    },
                },
            });

            const doctor = await prisma.doctor.create({
                data: {
                    userId: user.userId,
                    hospitalId: hospitalId,
                    departmentId: departmentId,
                    specializationId: parsedSpecializationId,
                    qualifications: professionalInformation.qualifications,
                    about,
                    phoneNo: contactInformation.phoneNumber,
                    status: "Online",
                    workingHours: "9-5",
                },
            });

            return { user, doctor };
        });

        return NextResponse.json(
            { message: "Doctor created successfully", result },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating doctor:", error);
        return NextResponse.json(
            { message: "Error creating doctor" },
            { status: 500 }
        );
    }
}
