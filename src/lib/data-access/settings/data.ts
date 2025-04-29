// src/lib/data-access/settings/data.ts

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import * as Sentry from "@sentry/nextjs";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NotificationSettings, User, Profile, Doctor, Nurse, Staff } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

// Types
export type ProfileUpdateData = {
    // Common fields
    firstName: string;
    lastName: string;
    phoneNo: string;
    cityOrTown?: string;
    county?: string;
    gender?: string;
    dateOfBirth?: string;
    address?: string;
    emergencyContact?: string;
    nextOfKin?: string;
    nextOfKinPhoneNo?: string;

    // Doctor-specific
    about?: string;
    qualifications?: string;
    workingHours?: string;
    yearsOfExperience?: number;
    skills?: string;
    licenses?: {
        name: string;
        licenseNumber: string;
        issuingAuthority: string;
        issueDate: string;
        expiryDate: string;
    }[];

    // Nurse/Staff
    status?: string;
};

export type SecuritySettings = Pick<
    User,
    "twoFactorEnabled" | "autoLogoutTimeout"
> & {
    newPassword?: string;
};

// Fetch complete user settings data
export async function fetchUserSettings(userId?: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/sign-in");

        const user = await prisma.user.findUnique({
            where: { userId: userId || session.user.id },
            include: {
                profile: true,
                notificationSettings: true,
                doctor: true,
                nurse: true,
                staff: true,
            },
        });

        if (!user) throw new Error("User not found");

        return {
            profile: {
                firstName: user.profile?.firstName || "",
                lastName: user.profile?.lastName || "",
                phoneNo: user.profile?.phoneNo || "",
                cityOrTown: user.profile?.cityOrTown || "",
                county: user.profile?.county || "",
                gender: user.profile?.gender || "",
                dateOfBirth: user.profile?.dateOfBirth?.toISOString() || "",
                address: user.profile?.address || "",
                emergencyContact: user.profile?.emergencyContact || "",
                nextOfKin: user.profile?.nextOfKin || "",
                nextOfKinPhoneNo: user.profile?.nextOfKinPhoneNo || "",
                imageUrl: user.profile?.imageUrl || "",

                ...user.profile,
                username: user.username,
                email: user.email,
            },
            roleSpecific: {
                doctor: user.doctor || {},
                nurse: user.nurse || {},
                staff: user.staff || {},
            },
            role: user.role,
            notificationSettings: user.notificationSettings || {
                appointmentAlerts: true,
                emailAlerts: true,
                securityAlerts: true,
                systemUpdates: true,
                newDeviceLogin: true,
            },
            securitySettings: {
                twoFactorEnabled: user.twoFactorEnabled,
                autoLogoutTimeout: user.autoLogoutTimeout,
            },
            username: user.username,
            email: user.email,
        };
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(getErrorMessage(error));
    }
}

// Update profile information
export async function updateProfile(data: ProfileUpdateData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
        }

        const updatedProfile = await prisma.profile.upsert({
            where: { userId: session.user.id },
            update: {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNo: data.phoneNo,
                cityOrTown: data.cityOrTown,
                county: data.county,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                address: data.address,
                emergencyContact: data.emergencyContact,
                nextOfKin: data.nextOfKin,
                nextOfKinPhoneNo: data.nextOfKinPhoneNo,
            },
            create: {
                userId: session.user.id,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNo: data.phoneNo,
                cityOrTown: data.cityOrTown,
                county: data.county,
                gender: data.gender,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                address: data.address,
                emergencyContact: data.emergencyContact,
                nextOfKin: data.nextOfKin,
                nextOfKinPhoneNo: data.nextOfKinPhoneNo,
            },
        });

        // Update doctor-specific fields if applicable
        if (data.qualifications || data.workingHours || data.yearsOfExperience || data.skills || data.licenses) {
            const doctor = await prisma.doctor.findFirst({
                where: { userId: session.user.id },
            });

            if (doctor) {
                await prisma.doctor.update({
                    where: { doctorId: doctor.doctorId },
                    data: {
                        qualifications: data.qualifications,
                        workingHours: data.workingHours,
                        yearsOfExperience: data.yearsOfExperience,
                        skills: data.skills,
                        docLicenses: {
                            createMany: {
                                data: data.licenses?.map(license => ({
                                    name: license.name,
                                    licenseNumber: license.licenseNumber,
                                    issuingAuthority: license.issuingAuthority,
                                    issueDate: new Date(license.issueDate),
                                    expiryDate: new Date(license.expiryDate),
                                })),
                            },
                        },
                    },
                });
            }
        }

        revalidatePath("/settings");
        return updatedProfile;
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(getErrorMessage(error));
    }
}

// Update profile USER information
export async function updateUser(data: { username: string; email: string }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) redirect("/sign-in");

        // Validate uniqueness of username and email
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: data.username, userId: { not: session.user.id } },
                    { email: data.email, userId: { not: session.user.id } },
                ],
            },
        });

        if (existingUser) {
            if (existingUser.username === data.username) {
                throw new Error("Username already taken");
            }
            if (existingUser.email === data.email) {
                throw new Error("Email already in use");
            }
        }

        // Update user details
        const updatedUser = await prisma.user.update({
            where: { userId: session.user.id },
            data: {
                username: data.username,
                email: data.email,
            },
        });

        revalidatePath("/settings");
        return updatedUser;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const meta = error.meta as { target?: string[] };
                if (meta?.target?.includes("email")) {
                    throw new Error("Email already in use");
                }
                if (meta?.target?.includes("username")) {
                    throw new Error("Username already taken");
                }
            }
        }
        Sentry.captureException(error);
        throw new Error(getErrorMessage(error));
    }
}

// Update notification preferences
export async function updateNotificationSettings(
    settings: Omit<
        NotificationSettings,
        "notificationSettingsId" | "userId" | "user"
    >
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
        }

        // Upsert notification settings
        const updatedSettings = await prisma.notificationSettings.upsert({
            where: { userId: session.user.id },
            update: settings,
            create: {
                userId: session.user.id,
                ...settings,
            },
        });

        revalidatePath("/settings");
        return updatedSettings;
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(getErrorMessage(error));
    }
}

// Update security settings
export async function updateSecuritySettings(settings: SecuritySettings) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
        }

        // Prepare the data object for updating
        const updateData: Partial<User> = {
            twoFactorEnabled: settings.twoFactorEnabled,
            autoLogoutTimeout: settings.autoLogoutTimeout,
        };

        // If updating password, hash it before saving
        if (settings.newPassword) {
            const hashedPassword = await bcrypt.hash(settings.newPassword, 12);
            updateData.password = hashedPassword;
        }

        // Update user's security settings
        const updatedUser = await prisma.user.update({
            where: { userId: session.user.id },
            data: updateData,
        });

        revalidatePath("/settings");
        return updatedUser;
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(getErrorMessage(error));
    }
}

// Change password
export async function changePassword(
    currentPassword: string,
    newPassword: string
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
        }

        // Fetch the current user
        const user = await prisma.user.findUnique({
            where: { userId: session.user.id },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Validate the current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update the user's password
        const updatedUser = await prisma.user.update({
            where: { userId: session.user.id },
            data: { password: hashedPassword },
        });

        return updatedUser;
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(getErrorMessage(error));
    }
}

// Update email address
export async function updateEmail(newEmail: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
        }

        // Check if the new email is already in use
        const existingUser = await prisma.user.findFirst({
            where: {
                email: newEmail,
                userId: { not: session.user.id },
            },
        });

        if (existingUser) {
            throw new Error("Email already in use");
        }

        // Update the user's email
        const updatedUser = await prisma.user.update({
            where: { userId: session.user.id },
            data: { email: newEmail },
        });

        revalidatePath("/settings");
        return updatedUser;
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new Error("Email already in use");
        }
        Sentry.captureException(error);
        throw new Error(getErrorMessage(error));
    }
}
