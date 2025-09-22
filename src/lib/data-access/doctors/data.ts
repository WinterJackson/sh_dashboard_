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
            select: {
                doctorId: true,
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
            select: {
                doctorId: true,
                status: true,
                averageRating: true,
                user: {
                    select: {
                        profile: {
                            select: {
                                imageUrl: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                specialization: {
                    select: {
                        name: true,
                    },
                },
                department: {
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

        const doctorSelect = {
            doctorId: true,
            status: true,
            averageRating: true,
            user: {
                select: {
                    createdAt: true,
                    profile: {
                        select: {
                            imageUrl: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            },
            specialization: {
                select: {
                    name: true,
                },
            },
            department: {
                select: {
                    name: true,
                },
            },
            hospital: {
                select: {
                    hospitalName: true,
                },
            },
        };

        if (user.role === "SUPER_ADMIN") {
            doctors = await prisma.doctor.findMany({
                select: doctorSelect,
            }) as any;
        } else if (user.hospitalId) {
            doctors = await prisma.doctor.findMany({
                where: { hospitalId: parseInt(user.hospitalId, 10) }, // Convert back to number
                select: doctorSelect,
            }) as any;
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
            select: {
                doctorId: true,
                status: true,
                averageRating: true,
                user: {
                    select: {
                        profile: {
                            select: {
                                imageUrl: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                specialization: {
                    select: {
                        name: true,
                    },
                },
                department: {
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
        gender: string | null;
        hospitalId: number;
        departmentId: number;
        specializationId: number;
        phoneNo: string;
        dateOfBirth: string;
        qualifications?: string;
        about?: string; // 'about' from form
        status?: string;
        profileImageUrl?: string | null;
    },
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<any> {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/sign-in");
    }

    // Security check: Only SUPER_ADMIN and ADMIN can add doctors.
    if (session.user.role !== Role.SUPER_ADMIN && session.user.role !== Role.ADMIN) {
        throw new Error("Unauthorized: You do not have permission to add a doctor.");
    }

    try {
        // Transaction to ensure all or nothing is created
        const newDoctor = await prisma.$transaction(async (tx) => {
            const username = `${doctorData.firstName.toLowerCase()}.${doctorData.lastName.toLowerCase()}`;
            
            // 1. Check if user already exists by email or username
            const existingUserByEmail = await tx.user.findUnique({
                where: { email: doctorData.email },
            });
            if (existingUserByEmail) {
                throw new Error("A user with this email already exists.");
            }

            const existingUserByUsername = await tx.user.findUnique({
                where: { username: username },
            });
            if (existingUserByUsername) {
                throw new Error("A user with this username already exists. Please try a different name combination.");
            }

            // 2. Create User record
            const resetToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
            const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

            const createdUser = await tx.user.create({
                data: {
                    username: username,
                    email: doctorData.email,
                    password: await bcrypt.hash(doctorData.phoneNo, 10), // Temporary password, e.g., phone number
                    role: Role.DOCTOR,
                    hospitalId: doctorData.hospitalId,
                    mustResetPassword: true,
                    resetToken: hashedToken,
                    resetTokenExpiry: expiryDate,
                    hasCompletedOnboarding: false, // New users must complete onboarding
                },
            });

            // 3. Create Profile record
            await tx.profile.create({
                data: {
                    userId: createdUser.userId,
                    firstName: doctorData.firstName,
                    lastName: doctorData.lastName,
                    gender: doctorData.gender,
                    phoneNo: doctorData.phoneNo,
                    dateOfBirth: new Date(doctorData.dateOfBirth),
                    imageUrl: doctorData.profileImageUrl,
                },
            });

            // 4. Create Doctor record
            const createdDoctor = await tx.doctor.create({
                data: {
                    userId: createdUser.userId,
                    hospitalId: doctorData.hospitalId,
                    departmentId: doctorData.departmentId,
                    specializationId: doctorData.specializationId,
                    qualifications: doctorData.qualifications,
                    bio: doctorData.about,
                    status: doctorData.status || "Offline",
                    phoneNo: doctorData.phoneNo,
                    // Default values for other fields
                    workingHours: "9am-5pm",
                    averageRating: 0,
                },
            });

            // Send email outside of transaction if possible, but we need the token
            const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
            await sendEmail({
                to: doctorData.email,
                subject: "Welcome & Set Your Password",
                text: `Welcome to Snark Health! You have been added as a doctor. Please click the link below to set your password. This link will expire in 1 hour: ${resetUrl}`,
                html: `<p>Welcome to Snark Health!</p><p>You have been added as a doctor. Please click the link below to set your password. This link will expire in 1 hour:</p><a href="${resetUrl}">${resetUrl}</a>`,
            });

            return createdDoctor;
        });

        revalidatePath("/dashboard/doctors");
        return newDoctor;

    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: {
                errorMessage,
                doctorData,
                user,
            },
        });
        // Re-throw with a user-friendly message
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                 const target = (error.meta?.target as string[]) || [];
                 if (target.includes('email')) {
                     throw new Error("A user with this email already exists.");
                 }
                 if (target.includes('username')) {
                     throw new Error("A user with this username already exists. Please try a different name combination.");
                 }
            }
        }
        throw new Error(errorMessage);
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
            select: {
                doctorId: true,
                status: true,
                averageRating: true,
                user: {
                    select: {
                        profile: {
                            select: {
                                imageUrl: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                specialization: {
                    select: {
                        name: true,
                    },
                },
                department: {
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
