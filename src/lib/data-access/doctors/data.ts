// src/lib/data-access/doctors/data.ts

"use server";

import { Doctor, DoctorLicense, Profile, DoctorReview, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getErrorMessage } from "@/hooks/getErrorMessage";

import prisma from "@/lib/prisma";

/**
 * Fetch top doctors based on user's role and hospitalId.
 */
export async function fetchTopDoctors(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<
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
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    // Define the base filter based on role
    let whereClause: Record<string, any> = {};

    switch (role) {
        case "SUPER_ADMIN":
            // Fetch all doctors across hospitals
            break;

        case "ADMIN":
        case "DOCTOR":
        case "NURSE":
        case "STAFF":
            if (hospitalId === null) {
                console.error(`${role}s must have a valid hospital ID.`);
                return [];
            }
            // Restrict results to the specified hospital
            whereClause.hospitalId = hospitalId;
            break;

        default:
            console.error("Invalid role for fetching top doctors.");
            return [];
    }

    try {
        // Query top doctors based on the average rating
        const topDoctors = await prisma.doctor.findMany({
            where: whereClause,
            orderBy: {
                averageRating: "desc",
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
                    doctor.user?.profile?.imageUrl || "/default-profile.png",
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
export async function fetchOnlineDoctors(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<Doctor[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = { status: "Online" };

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all online doctors
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    console.error(`${role}s must have an associated hospital ID.`);
                    return [];
                }
                // Filter by hospitalId for other roles
                whereClause.hospitalId = hospitalId;
                break;

            default:
                console.error("Invalid role provided.");
                return [];
        }

        // Fetch online doctors based on the filter criteria
        const onlineDoctors = await prisma.doctor.findMany({
            where: whereClause,
            include: {
                user: {
                    include: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                gender: true,
                                phoneNo: true,
                                address: true,
                                dateOfBirth: true,
                                cityOrTown: true,
                                county: true,
                                imageUrl: true,
                                nextOfKin: true,
                                nextOfKinPhoneNo: true,
                                emergencyContact: true,
                            },
                        },
                    },
                },
                hospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
                department: {
                    select: {
                        name: true,
                    },
                },
                specialization: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return onlineDoctors;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch online doctors:", errorMessage);
        return [];
    }
}

/**
 * Fetch count of online doctors based on user's role and hospitalId.
 */
export async function fetchOnlineDoctorsCount(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<number> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return 0;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = { status: "Online" };

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all online doctors
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                // Filter by hospitalId for other roles
                whereClause.hospitalId = hospitalId;
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Count online doctors based on the filter criteria
        const onlineDoctorsCount = await prisma.doctor.count({
            where: whereClause,
        });

        return onlineDoctorsCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching online doctors count:", errorMessage);
        return 0;
    }
}

/**
 * Fetch complete doctor profile data for Bio display
 */
export async function fetchDoctorDetails(
    doctorId: number,
    user?: { role: Role; hospitalId: number | null }
): Promise<
    | (Doctor & {
          licenses: DoctorLicense[];
          reviews: DoctorReview[];
          user: { profile: Profile };
          specialization: { name: string };
          department: { name: string };
          hospital: { hospitalName: string };
      })
    | null
> {
    if (!user) {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
            return null;
        }
        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
        };
    }

    const { role, hospitalId } = user;

    try {
        // Authorization check
        if (
            role !== Role.SUPER_ADMIN &&
            (!hospitalId || ![Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.STAFF].includes(role))
        ) {
            console.error("Unauthorized doctor details access");
            return null;
        }

        const doctorDetails = await prisma.doctor.findUnique({
            where: {
                doctorId,
                ...(role !== Role.SUPER_ADMIN && { hospitalId }),
            },
            include: {
                docLicenses: true,
                docReviews: true,
                user: {
                    include: {
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                imageUrl: true,
                                dateOfBirth: true,
                                phoneNo: true,
                            },
                        },
                    },
                },
                specialization: { select: { name: true } },
                department: { select: { name: true } },
                hospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
            },
        });

        if (!doctorDetails) {
            console.warn(`Doctor not found: ${doctorId}`);
            return null;
        }

        return {
            ...doctorDetails,
            licenses: doctorDetails.docLicenses || [],
            reviews: doctorDetails.docReviews || [],
            skills: doctorDetails.skills || [],
            yearsOfExperience:
                doctorDetails.yearsOfExperience ||
                new Date().getFullYear() -
                    new Date(doctorDetails.user.profile.dateOfBirth).getFullYear(),
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Doctor details fetch failed:", errorMessage);
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
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    try {
        if (!userId) {
            console.error("User ID is required");
            return null;
        }

        switch (user.role) {
            case "SUPER_ADMIN":
                // SUPER_ADMIN can fetch any doctor's ID
                break;

            case "ADMIN":
                if (user.hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                break;

            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (user.hospitalId === null) {
                    throw new Error(`${user.role}s must have an associated hospital ID.`);
                }
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch the doctor ID based on the provided userId
        const doctor = await prisma.doctor.findUnique({
            where: { userId },
            select: { doctorId: true, hospitalId: true },
        });

        if (!doctor) {
            return null;
        }

        // Validate hospital association for non-SUPER_ADMIN roles
        if (
            user.role !== "SUPER_ADMIN" &&
            user.hospitalId !== null &&
            doctor.hospitalId !== user.hospitalId
        ) {
            console.error("Unauthorized access: Doctor does not belong to the user's hospital.");
            return null;
        }

        return { doctorId: doctor.doctorId };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
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
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    try {
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all doctors
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    console.error(`${role}s must have an associated hospital ID.`);
                    return [];
                }
                // Filter by hospitalId for other roles
                whereClause.hospitalId = hospitalId;
                break;

            default:
                console.error("Invalid role provided.");
                return [];
        }

        // Fetch all doctors based on the filter criteria
        const doctors = await prisma.doctor.findMany({
            where: whereClause,
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
                                cityOrTown: true,
                                county: true,
                                nextOfKin: true,
                                nextOfKinPhoneNo: true,
                                emergencyContact: true,
                            },
                        },
                    },
                },
                hospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
                department: {
                    select: {
                        name: true,
                    },
                },
                specialization: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return doctors;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch all doctors:", errorMessage);
        return [];
    }
}

/**
 * Fetch all doctors based on user role and hospitalId.
 */
export async function fetchDoctors(user?: {
    role: Role;
    hospitalId: string | null;
    userId: string | null;
}): Promise<Doctor[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId
                ? String(session.user.hospitalId)
                : null,
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
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    try {
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // SUPER_ADMIN can fetch doctors from any hospital
                whereClause = { hospitalId };
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (user.hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                // Ensure the hospitalId matches the user's associated hospital
                if (hospitalId !== user.hospitalId) {
                    console.error("Unauthorized access: Hospital ID mismatch.");
                    return [];
                }
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch doctors based on the filter criteria
        const doctors = await prisma.doctor.findMany({
            where: whereClause,
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
                                cityOrTown: true,
                                county: true,
                                nextOfKin: true,
                                nextOfKinPhoneNo: true,
                                emergencyContact: true,
                            },
                        },
                    },
                },
                hospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
                department: {
                    select: {
                        name: true,
                    },
                },
                specialization: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return doctors;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
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
        phoneNo: string;
        dateOfBirth: string;
        qualifications?: string;
        bio?: string;
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
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    try {
        // Validate foreign keys
        const [
            hospitalExists,
            departmentExists,
            specializationExists,
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
        ]);

        if (!hospitalExists || !departmentExists || !specializationExists) {
            console.error("Invalid hospital, department, or specialization");
            return null;
        }

        let userRecord = null;
        let doctorRecord = null;
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
                const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

                userRecord = await tx.user.create({
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
                        userId: userRecord.userId,
                        firstName: doctorData.firstName,
                        lastName: doctorData.lastName,
                        gender: doctorData.gender || null,
                        phoneNo: doctorData.phoneNo,
                        dateOfBirth: new Date(doctorData.dateOfBirth),
                        imageUrl: doctorData.profileImageUrl || null,
                        address: null,
                        cityOrTown: null,
                        county: null,
                        nextOfKin: null,
                        nextOfKinPhoneNo: null,
                        emergencyContact: null,
                    },
                });
            } else {
                userRecord = existingUser;

                // Check if doctor record already exists
                const existingDoctor = await tx.doctor.findUnique({
                    where: { userId: userRecord.userId },
                });

                if (existingDoctor) {
                    console.error("Doctor already exists for this user.");
                    throw new Error("Doctor already exists.");
                }
            }

            doctorRecord = await tx.doctor.create({
                data: {
                    userId: userRecord.userId,
                    hospitalId: doctorData.hospitalId,
                    departmentId: doctorData.departmentId,
                    specializationId: doctorData.specializationId,
                    qualifications: doctorData.qualifications || null,
                    bio: doctorData.bio || null,
                    status: doctorData.status || "Offline",
                    phoneNo: doctorData.phoneNo,
                    workingHours: "Mon-Fri: 9AM-5PM",
                    averageRating: 0,
                    skills: null,
                    yearsOfExperience: null,
                },
            });
        });

        // Send reset email
        if (resetToken && userRecord) {
            const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;

            await sendEmail({
                to: doctorData.email,
                subject: "Set Your Password",
                text: `You have been added as a doctor. Click the link below to set your password. This link will expire in 1 hour: ${resetUrl}`,
                html: `<p>You have been added as a doctor. Click the link below to set your password. This link will expire in 1 hour:</p>
                       <a href="${resetUrl}">${resetUrl}</a>`,
            });
        }

        return doctorRecord;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
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
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    try {
        let whereClause: any = { specializationId };

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all doctors with the given specialization
                break;

            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                // Admins see doctors within their associated hospital
                whereClause.hospitalId = hospitalId;
                break;

            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                // Staff members see doctors within their associated hospital
                whereClause.hospitalId = hospitalId;
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch doctors based on the filter criteria
        const doctors = await prisma.doctor.findMany({
            where: whereClause,
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
                                cityOrTown: true,
                                county: true,
                                nextOfKin: true,
                                nextOfKinPhoneNo: true,
                                emergencyContact: true,
                            },
                        },
                    },
                },
                hospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
                department: {
                    select: {
                        name: true,
                    },
                },
                specialization: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return doctors;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch doctors by specialization:", errorMessage);
        return [];
    }
}
