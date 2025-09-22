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
import { NotificationSettings, User, Profile, AuditAction, UserSettingsData } from "@/lib/definitions";
import { updatePassword } from "@/lib/utils/updatePassword";
import { sendEmail } from "@/lib/email";
import { getClientIP } from "@/lib/utils/getClientIP";
import { anonymizeIP } from "@/lib/utils/anonymizeIP";

import prisma from "@/lib/prisma";

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
export async function fetchUserSettings(userId?: string): Promise<UserSettingsData | null> {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return null;
        }

        const dbUser = await prisma.user.findUnique({
            where: { userId: userId || session.user.id },
            include: {
                profile: true,
                notificationSettings: true,
                doctor: true,
                nurse: true,
                staff: true,
            },
        });

        if (!dbUser) throw new Error("User not found");

        // Convert Prisma types to plain objects + format dates
        const user: User = {
            userId: dbUser.userId,
            username: dbUser.username,
            email: dbUser.email,
            password: dbUser.password,
            role: dbUser.role,
            hospitalId: dbUser.hospitalId ?? undefined,
            isActive: dbUser.isActive,
            lastLogin: dbUser.lastLogin ?? undefined,
            mustResetPassword: dbUser.mustResetPassword,
            resetToken: dbUser.resetToken ?? undefined,
            resetTokenExpiry: dbUser.resetTokenExpiry ?? undefined,
            createdAt: dbUser.createdAt,
            updatedAt: dbUser.updatedAt,
            twoFactorEnabled: dbUser.twoFactorEnabled,
            autoLogoutTimeout: dbUser.autoLogoutTimeout ?? 30,
            hasCompletedOnboarding: dbUser.hasCompletedOnboarding,
            doctor: dbUser.doctor ? { ...dbUser.doctor } : undefined,
            profile: dbUser.profile ? { ...dbUser.profile } : undefined,
            sessions: [],
            hospital: undefined,
            superAdmin: undefined,
            admin: undefined,
            nurse: dbUser.nurse ? { ...dbUser.nurse } : undefined,
            staff: dbUser.staff ? { ...dbUser.staff } : undefined,
            patient: undefined,
            notifications: [],
            notificationSettings: dbUser.notificationSettings
                ? { ...dbUser.notificationSettings }
                : undefined,
            conversationParticipant: [],
            messages: [],
            notes: [],
            uploadedDocuments: [],
            auditLog: [],
        };

        const profile: Profile = {
            profileId: user.profile?.profileId ?? "",
            userId: user.userId,
            firstName: user.profile?.firstName ?? "",
            lastName: user.profile?.lastName ?? "",
            gender: user.profile?.gender ?? undefined,
            phoneNo: user.profile?.phoneNo ?? "",
            address: user.profile?.address ?? "",
            dateOfBirth: user.profile?.dateOfBirth
                ? new Date(user.profile.dateOfBirth)
                : null,
            cityOrTown: user.profile?.cityOrTown ?? "",
            county: user.profile?.county ?? "",
            imageUrl: user.profile?.imageUrl ?? "",
            nextOfKin: user.profile?.nextOfKin ?? "",
            nextOfKinPhoneNo: user.profile?.nextOfKinPhoneNo ?? "",
            emergencyContact: user.profile?.emergencyContact ?? "",
            user,
        };

        const roleSpecific = {
            doctor: user.doctor ?? {},
            nurse: user.nurse ?? {},
            staff: user.staff ?? {},
        };

        const notificationSettings: NotificationSettings = user.notificationSettings
            ? {
                  ...user.notificationSettings,
                  user,
              }
            : {
                  notificationSettingsId: "",
                  userId: user.userId,
                  appointmentAlerts: true,
                  emailAlerts: true,
                  securityAlerts: true,
                  systemUpdates: true,
                  newDeviceLogin: true,
                  user,
              };

        // structured settings object `UserSettingsData`
        const result: UserSettingsData = {
            profile: {
                ...profile,
                username: user.username,
                email: user.email,
            },
            roleSpecific,
            role: user.role,
            notificationSettings,
            securitySettings: {
                twoFactorEnabled: user.twoFactorEnabled,
                autoLogoutTimeout: user.autoLogoutTimeout,
            },
            username: user.username,
            email: user.email,
        };

        return result;
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

/**
 * Update security settings for a user
 */
export async function updateSecuritySettings(settings: SecuritySettings) {
    const session = await getServerSession(authOptions);

    try {
        if (!session?.user) {
            redirect("/sign-in");
        }

        const userId = session.user.id;

        // Fetch current user to check for changes
        const currentUser = await prisma.user.findUnique({
            where: { userId },
        });

        if (!currentUser) {
            throw new Error("User not found");
        }

        // Early exit if nothing changed
        if (
            currentUser.twoFactorEnabled === settings.twoFactorEnabled &&
            currentUser.autoLogoutTimeout === settings.autoLogoutTimeout &&
            !settings.newPassword
        ) {
            return currentUser; // No changes, skip DB update
        }

        // Prepare update object
        const updateData: Partial<User> = {
            twoFactorEnabled: settings.twoFactorEnabled,
            autoLogoutTimeout: settings.autoLogoutTimeout,
        };

        // Hash new password if provided
        if (settings.newPassword) {
            const hashedPassword = await bcrypt.hash(settings.newPassword, 12);
            updateData.password = hashedPassword;

            // Revoke all sessions if password changed
            await prisma.session.deleteMany({ where: { userId } });
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { userId },
            data: updateData,
        });

        // Log audit
        await prisma.auditLog.create({
            data: {
                action: settings.newPassword
                    ? AuditAction.RESET_PASSWORD
                    : AuditAction.MFA_ENABLED,
                userId,
                status: "SUCCESS",
                meta: {
                    method: settings.newPassword ? "manual_change" : "mfa_change",
                    revokedSessions: Boolean(settings.newPassword),
                    timestamp: new Date().toISOString(),
                },
            },
        });

        revalidatePath("/settings");
        return updatedUser;
    } catch (error) {
        // Log failed attempt
        await prisma.auditLog.create({
            data: {
                action: settings.newPassword
                    ? AuditAction.RESET_PASSWORD
                    : AuditAction.MFA_ENABLED,
                userId: session?.user?.id ?? null,
                status: "FAILED",
                meta: {
                    error: error instanceof Error ? error.message : String(error),
                    attemptedAt: new Date().toISOString(),
                },
            },
        });

        Sentry.captureException(error);
        throw new Error(getErrorMessage(error));
    }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
        }

        const user = await prisma.user.findUnique({
            where: { userId: session.user.id },
        });

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Update password and revoke sessions
        const updatedUser = await updatePassword({
            userId: session.user.id,
            newPassword,
            reason: "manual_change",
            shouldRevokeSessions: true,
        });

        // Send email notification
        if (user.email) {
            const subject = "Your Password Has Been Changed";
            const text = `Hello,\n\nYour password has been changed successfully.\n\nYou have been logged out from all devices.\n\nIf this wasn't you, please contact support immediately.\n\nBest regards,\nThe SecureTeam`;
            const html = `<p>Hello,</p>
                <p>Your password has been changed successfully.</p>
                <p>You have been logged out from all devices.</p>
                <p>If this wasn't you, please contact support immediately.</p>
                <p>Best regards,<br/>SNARK HEALTH</p>`;

            try {
                await sendEmail({ to: user.email, subject, text, html });
            } catch (emailError) {
                console.error(
                    "Failed to send password change email:",
                    emailError
                );

                // Log email failure in audit logs
                await prisma.auditLog.create({
                    data: {
                        action: AuditAction.RESET_PASSWORD,
                        userId: session.user.id,
                        status: "EMAIL_FAILED",
                        meta: {
                            reason: "Failed to send email after password change",
                            error:
                                emailError instanceof Error
                                    ? emailError.message
                                    : String(emailError),
                        },
                    },
                });
            }
        }

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

export async function fetchSecuritySettings(userId?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/sign-in");

    const dbUser = await prisma.user.findUnique({
        where: { userId: userId || session.user.id },
        select: {
            email: true,
            twoFactorEnabled: true,
            autoLogoutTimeout: true,
        },
    });

    if (!dbUser) throw new Error("User not found");

    return {
        email: dbUser.email,
        securitySettings: {
            twoFactorEnabled: dbUser.twoFactorEnabled,
            autoLogoutTimeout: dbUser.autoLogoutTimeout ?? 30,
        },
    };
}
