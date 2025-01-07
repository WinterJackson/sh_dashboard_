// src/lib/data-access/doctors/data.ts

"use server";

import { Doctor, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

/**
 * Fetch top doctors based on user's role and hospitalId.
 */
export async function fetchTopDoctors(
    user?: { role: Role; hospitalId: number | null }
): Promise<
    {
        doctorId: number;
        imageUrl: string;
        name: string;
        rating: number;
        specialization: string;
    }[]
> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    // Define the base filter based on role
    let whereClause: Record<string, any> = {};

    switch (role) {
        case "SUPER_ADMIN":
            // Fetch all doctors across hospitals
            whereClause = {};
            break;

        case "ADMIN":
        case "DOCTOR":
        case "NURSE":
        case "STAFF":
            if (!hospitalId) {
                console.error(`${role}s must have a valid hospital ID.`);
                return []; // Return an empty array instead of throwing an error
            }
            // Restrict results to the specified hospital
            whereClause = { hospitalId };
            break;

        default:
            console.error("Invalid role for fetching top doctors.");
            return []; // Return an empty array instead of throwing an error
    }

    try {
        // Query top doctors based on the average rating
        const topDoctors = await prisma.doctor.findMany({
            where: whereClause,
            orderBy: {
                averageRating: "desc", // Sort by highest average rating
            },
            take: 5, // Limit to the top 5 doctors
            select: {
                doctorId: true,
                averageRating: true,
                specialization: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                imageUrl: true,
                            },
                        },
                    },
                },
            },
        });

        // Map and format the results
        return topDoctors.map(
            (doctor: {
                doctorId: number;
                averageRating: number;
                specialization: { name: string } | null;
                user: {
                    profile: {
                        firstName: string;
                        lastName: string;
                        imageUrl: string;
                    } | null;
                } | null;
            }) => ({
                doctorId: doctor.doctorId,
                imageUrl:
                    doctor.user?.profile?.imageUrl || "/default-profile.png", // Fallback to default image
                name: `Dr. ${doctor.user?.profile?.firstName || "Unknown"} ${
                    doctor.user?.profile?.lastName || "Name"
                }`,
                rating: doctor.averageRating,
                specialization: doctor.specialization?.name || "General",
            })
        );
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch top doctors:", errorMessage);
        return [];
    }
}

/**
 * Fetch all online doctors.
 */
export async function fetchOnlineDoctors(
    user?: { role: Role; hospitalId: number | null }
): Promise<Doctor[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        if (role !== "SUPER_ADMIN" && !hospitalId) {
            console.error("Unauthorized access: Hospital ID is required.");
            return [];
        }

        const onlineDoctors = await prisma.doctor.findMany({
            where: {
                status: "Online",
                ...(hospitalId && { hospitalId }),
            },
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

        return onlineDoctors
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Failed to fetch online doctors:", errorMessage);
        return [];
    }
}

/**
 * Fetch count of online doctors based on user's role and hospitalId.
 */
export async function fetchOnlineDoctorsCount(
    user?: { role: Role; hospitalId: number | null }
): Promise<number> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return 0;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        let onlineDoctorsCount = 0;

        if (role === "SUPER_ADMIN") {
            // Count all online doctors for SUPER_ADMIN
            onlineDoctorsCount = await prisma.doctor.count({
                where: { status: "Online" },
            });
        } else if (hospitalId) {
            // Count online doctors for other roles based on hospitalId
            onlineDoctorsCount = await prisma.doctor.count({
                where: {
                    status: "Online",
                    hospitalId: hospitalId,
                },
            });
        }

        return onlineDoctorsCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Error fetching online doctors count:", errorMessage);
        return 0;
    }
}

/**
 * Fetch details of a specific doctor by doctorId.
 */
export async function fetchDoctorDetails(
    doctorId: number,
    user?: { role: Role; hospitalId: number | null }
): Promise<Doctor | null> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return null;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
        };
    }

    const { role, hospitalId } = user;

    try {
        if (role !== "SUPER_ADMIN" && (!hospitalId || role !== "ADMIN")) {
            console.error("Unauthorized access");
            return null;
        }

        const doctorDetails = await prisma.doctor.findUnique({
            where: { doctorId },
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

        return doctorDetails
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Failed to fetch doctor details:", errorMessage);
        return null;
    }
}

/**
 * Fetch doctor ID by associated user ID.
 * @param userId - The user ID of the doctor.
 * @returns An object containing the doctorId or null if not found.
 */
export async function fetchDoctorIdByUserId(
    userId: string,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<{ doctorId: number } | null> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return null;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    try {
        if (!userId) {
            console.error("User ID is required");
            return null;
        }

        const doctor = await prisma.doctor.findUnique({
            where: { userId },
            select: { doctorId: true },
        });

        if (!doctor) {
            return null; // Return null if the doctor is not found
        }

        return doctor; // Return the doctorId
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Failed to fetch doctor ID by user ID:", errorMessage);
        return null;
    }
}

/**
 * Fetch all doctors with optional filtering by hospitalId.
 */
export async function fetchAllDoctors(
    hospitalId: number | null,
    role: Role,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Doctor[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    try {
        if (role !== "SUPER_ADMIN" && !hospitalId) {
            console.error("Unauthorized access");
            return [];
        }

        const doctors = await prisma.doctor.findMany({
            where: hospitalId ? { hospitalId } : undefined,
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

        return doctors
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Failed to fetch all doctors:", errorMessage);
        return [];
    }
}

/**
 * Fetch all doctors based on user role and hospitalId.
 */
export async function fetchDoctors(
    user?: { role: Role; hospitalId: string | null; userId: string | null }
): Promise<Doctor[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ? String(session.user.hospitalId) : null,
            userId: session.user.id,
        };
    }

    try {
        let doctors: Doctor[] = [];

        if (user.role === "SUPER_ADMIN") {
            doctors = await prisma.doctor.findMany({
                include: {
                    hospital: true,
                    specialization: true,
                    department: true,
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        } else if (user.hospitalId) {
            doctors = await prisma.doctor.findMany({
                where: { hospitalId: parseInt(user.hospitalId, 10) }, // Convert back to number
                include: {
                    hospital: true,
                    specialization: true,
                    department: true,
                    user: {
                        include: {
                            profile: true,
                        },
                    },
                },
            });
        }

        return doctors;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Failed to fetch doctors:", errorMessage);
        return [];
    }
}

/**
 * Fetch doctors by hospital ID.
 */
export async function fetchDoctorsByHospital(
    hospitalId: number,
    role: Role,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Doctor[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    try {

        const doctors = await prisma.doctor.findMany({
            where: { hospitalId },
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

        return doctors
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Failed to fetch doctors by hospital:", errorMessage);
        return [];
    }
}

/**
 * Adds a new doctor to the system.
 * Handles user creation, doctor record creation, and sending reset email.
 */
export async function addDoctorAPI(
    doctorData: {
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
    },
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<any> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return null;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    try {
        // Validate foreign keys
        const [
            hospitalExists,
            departmentExists,
            specializationExists,
            serviceExists,
        ] = await prisma.$transaction([
            prisma.hospital.findUnique({
                where: { hospitalId: doctorData.hospitalId },
                select: { hospitalId: true },
            }),
            prisma.department.findUnique({
                where: { departmentId: doctorData.departmentId },
                select: { departmentId: true },
            }),
            prisma.specialization.findUnique({
                where: { specializationId: doctorData.specializationId },
                select: { specializationId: true },
            }),
            prisma.service.findUnique({
                where: { serviceId: doctorData.serviceId || -1 },
                select: { serviceId: true },
            }),
        ]);

        if (!hospitalExists || !departmentExists || !specializationExists) {
            console.error("Invalid hospital, department, or specialization");
            return null;
        }

        if (doctorData.serviceId && !serviceExists) {
            console.error("Invalid service selected");
            return null;
        }

        let user = null;
        let doctor = null;
        let resetToken = null;

        // Transaction for user and doctor creation
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const existingUser = await tx.user.findUnique({
                where: { email: doctorData.email },
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
                        username: `${doctorData.firstName}_${doctorData.lastName}`,
                        email: doctorData.email,
                        password: await bcrypt.hash(doctorData.firstName, 10),
                        role: "DOCTOR",
                        hospitalId: doctorData.hospitalId,
                        mustResetPassword: true,
                        resetToken: hashedToken,
                        resetTokenExpiry: expiryDate,
                    },
                });

                await tx.profile.create({
                    data: {
                        userId: user.userId,
                        firstName: doctorData.firstName,
                        lastName: doctorData.lastName,
                        gender: doctorData.gender || null,
                        phoneNo: doctorData.phoneNo,
                        dateOfBirth: new Date(doctorData.dateOfBirth),
                        imageUrl: doctorData.profileImageUrl || null,
                    },
                });
            } else {
                user = existingUser;
            }

            doctor = await tx.doctor.create({
                data: {
                    userId: user.userId,
                    hospitalId: doctorData.hospitalId,
                    departmentId: doctorData.departmentId,
                    specializationId: doctorData.specializationId,
                    serviceId: doctorData.serviceId || undefined,
                    qualifications: doctorData.qualifications || null,
                    about: doctorData.about || null,
                    status: doctorData.status || "Offline",
                    phoneNo: doctorData.phoneNo,
                    workingHours: "Mon-Fri: 9AM-5PM",
                    averageRating: 0,
                },
            });
        });

        // Send reset email
        if (resetToken && user) {
            const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

            await sendEmail({
                to: doctorData.email,
                subject: "Set Your Password",
                text: `You have been added as a doctor. Click the link below to set your password. This link will expire in 1 hour: ${resetUrl}`,
                html: `<p>You have been added as a doctor. Click the link below to set your password. This link will expire in 1 hour:</p>
                       <a href="${resetUrl}">${resetUrl}</a>`,
            });
        }

        return doctor;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Error adding doctor:", errorMessage);
        return null;
    }
}

/**
 * Fetch doctors filtered by specialization.
 * @param specializationId - The specialization ID to filter by.
 * @param hospitalId - Filter by hospital ID if provided.
 * @param role - User role for access validation.
 */
export async function getDoctorsBySpecialization(
    specializationId: number,
    hospitalId: number | null,
    role: Role,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Doctor[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    try {
        if (role !== "SUPER_ADMIN" && (!hospitalId || role !== "ADMIN")) {
            console.error("Unauthorized access");
            return []
        }

        const doctors = await prisma.doctor.findMany({
            where: {
                specializationId,
                ...(hospitalId ? { hospitalId } : {}),
            },
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

        return doctors
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error);
        console.error("Failed to fetch doctors by specialization:", errorMessage);
        return [];
    }
}
