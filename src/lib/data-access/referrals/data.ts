// src/lib/data-access/referrals/data.ts

"use server";

import { Referral, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

export const fetchInwardReferrals = async (
    user?: { role: Role; hospitalId: number | null }
): Promise<Referral[]> => {
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
        if (role === "SUPER_ADMIN") {
            // Fetch all internal referrals for SUPER_ADMIN
            return await prisma.referral.findMany({
                where: { type: "Internal" },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.findMany({
                where: { type: "Internal", hospitalId },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        console.warn("No hospitalId provided for role:", role);
        return [];
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Error fetching inward referrals:", errorMessage);
        return [];
    }
};


export const fetchInwardReferralsCount = async (
    user?: { role: Role; hospitalId: number | null }
): Promise<number> => {
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
        if (role === "SUPER_ADMIN") {
            // Fetch all internal referrals count for SUPER_ADMIN
            return await prisma.referral.count({
                where: { type: "Internal" },
            });
        }

        if (hospitalId !== null) {
            // Fetch referrals count for other roles filtered by hospitalId
            return await prisma.referral.count({
                where: { type: "Internal", hospitalId },
            });
        }

        console.warn("No hospitalId provided for role:", role);
        return 0;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Error fetching inward referrals count:", errorMessage);
        return 0;
    }
};


export const fetchOutwardReferrals = async (
    user?: { role: Role; hospitalId: number | null }
): Promise<Referral[]> => {
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
        if (role === "SUPER_ADMIN") {
            // Fetch all external referrals for SUPER_ADMIN
            return await prisma.referral.findMany({
                where: { type: "External" },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.findMany({
                where: { type: "External", hospitalId },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        console.warn("No hospitalId provided for role:", role);
        return [];
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Error fetching outward referrals:", errorMessage);
        return [];
    }
};

export const fetchOutwardReferralsCount = async (
    user?: { role: Role; hospitalId: number | null }
): Promise<number> => {
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
        if (role === "SUPER_ADMIN") {
            // Fetch all external referrals count for SUPER_ADMIN
            return await prisma.referral.count({
                where: { type: "External" },
            });
        }

        if (hospitalId !== null) {
            // Fetch referrals count for other roles filtered by hospitalId
            return await prisma.referral.count({
                where: { type: "External", hospitalId },
            });
        }

        console.warn("No hospitalId provided for role:", role);
        return 0;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Error fetching outward referrals count:", errorMessage);
        return 0;
    }
};


/**
 * Create a new referral
 * @param data - The referral data to be persisted.
 * @returns The created referral.
 */
export async function createReferral(
    data: {
        patientId: number;
        patientName: string;
        gender: string;
        dateOfBirth: string;
        homeAddress?: string;
        state?: string;
        phoneNo: string;
        email: string;
        physicianName: string;
        physicianDepartment: string;
        physicianSpecialty: string;
        physicianEmail: string;
        physicianPhoneNumber: string;
        hospitalName: string;
        type: string;
        primaryCareProvider: string;
        referralAddress: string;
        referralPhone: string;
        reasonForConsultation: string;
        diagnosis: string;
        status: string;
    },
    user?: { role: Role; hospitalId: number | null }
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
        };
    }

    const { hospitalId: userHospitalId } = user;

    try {
        // Validate hospital existence
        const hospital = await prisma.hospital.findUnique({
            where: { name: data.hospitalName },
        });

        if (!hospital) {
            console.error(`Hospital with name '${data.hospitalName}' not found.`);
            return null;
        }

        const hospitalId = userHospitalId ?? hospital.hospitalId;

        // Upsert the patient
        const patient = await prisma.patient.upsert({
            where: { phoneNo: data.phoneNo },
            update: {
                name: data.patientName,
                gender: data.gender,
                dateOfBirth: new Date(data.dateOfBirth),
                homeAddress: data.homeAddress,
                state: data.state,
                phoneNo: data.phoneNo,
                email: data.email,
                reasonForConsultation: data.reasonForConsultation,
                status: data.status,
                hospitalId,
            },
            create: {
                name: data.patientName,
                gender: data.gender,
                dateOfBirth: new Date(data.dateOfBirth),
                homeAddress: data.homeAddress,
                state: data.state,
                phoneNo: data.phoneNo,
                email: data.email,
                reasonForConsultation: data.reasonForConsultation,
                status: data.status,
                hospitalId,
            },
        });

        // Ensure no duplicate referrals for the same day
        const referralDate = new Date();
        const existingReferral = await prisma.referral.findFirst({
            where: {
                patientId: patient.patientId,
                hospitalId,
                type: data.type,
                effectiveDate: {
                    gte: new Date(referralDate.setHours(0, 0, 0, 0)),
                    lt: new Date(referralDate.setHours(23, 59, 59, 999)),
                },
            },
        });

        if (existingReferral) {
            console.error("Referral already exists for today.");
            return null;
        }

        // Create the referral
        const newReferral = await prisma.referral.create({
            data: {
                patientId: patient.patientId,
                hospitalId,
                effectiveDate: new Date(),
                type: data.type,
                primaryCareProvider: data.primaryCareProvider,
                referralAddress: data.referralAddress,
                referralPhone: data.referralPhone,
                reasonForConsultation: data.reasonForConsultation,
                diagnosis: data.diagnosis,
                physicianName: data.physicianName,
                physicianDepartment: data.physicianDepartment,
                physicianSpecialty: data.physicianSpecialty,
                physicianEmail: data.physicianEmail,
                physicianPhoneNumber: data.physicianPhoneNumber,
            },
        });

        return newReferral;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, data, user } });
        console.error("Error creating referral:", errorMessage);
        return null;
    }
}

