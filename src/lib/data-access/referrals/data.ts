// src/lib/data-access/referrals/data.ts

"use server";

import { Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");

export const fetchInwardReferrals = async (
    role: string,
    hospitalId: number | null
) => {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }

    try {
        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all internal referrals for SUPER_ADMIN
            return await prisma.referral.findMany({
                where: {
                    type: "Internal",
                },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.findMany({
                where: {
                    type: "Internal",
                    hospitalId: hospitalId,
                },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        // Return empty array if role or hospitalId is invalid
        return [];
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching inward referrals:", error);

        throw new Error("Failed to fetch inward referrals.");
    }
};

export const fetchInwardReferralsCount = async (
    role: string,
    hospitalId: number | null
) => {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }

    try {
        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all internal referrals for SUPER_ADMIN
            return await prisma.referral.count({
                where: {
                    type: "Internal",
                },
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.count({
                where: {
                    type: "Internal",
                    hospitalId: hospitalId,
                },
            });
        }

        // Return zero if role or hospitalId is invalid
        return 0;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching inward referrals count:", error);

        throw new Error("Failed to fetch inward referrals count.");
    }
};

export const fetchOutwardReferrals = async (
    role: string,
    hospitalId: number | null
) => {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }

    try {
        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all external referrals for SUPER_ADMIN
            return await prisma.referral.findMany({
                where: {
                    type: "External",
                },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.findMany({
                where: {
                    type: "External",
                    hospitalId: hospitalId,
                },
                include: {
                    patient: true,
                    hospital: { select: { name: true, hospitalId: true } },
                },
            });
        }

        // Return empty array if role or hospitalId is invalid
        return [];
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching outward referrals:", error);

        throw new Error("Failed to fetch outward referrals.");
    }
};

export const fetchOutwardReferralsCount = async (
    role: string,
    hospitalId: number | null
) => {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        console.warn("Session is missing or invalid.");
        redirect("/sign-in");
        return [];
    }

    try {
        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all external referrals for SUPER_ADMIN
            return await prisma.referral.count({
                where: {
                    type: "External",
                },
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            return await prisma.referral.count({
                where: {
                    type: "External",
                    hospitalId: hospitalId,
                },
            });
        }

        // Return zero if role or hospitalId is invalid
        return 0;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error fetching outward referrals count:", error);

        throw new Error("Failed to fetch outward referrals count.");
    }
};

/**
 * Create a new referral
 * @param data - The referral data to be persisted.
 * @returns The created referral.
 */
export async function createReferral(data: {
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
}) {
    try {
        // Find the hospital by name
        const hospital = await prisma.hospital.findUnique({
            where: { name: data.hospitalName },
        });

        if (!hospital) {
            throw new Error(
                `Hospital with name '${data.hospitalName}' not found.`
            );
        }

        const hospitalId = hospital.hospitalId;

        // Upsert the patient
        const patient = await prisma.patient.upsert({
            where: { patientId: data.patientId },
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

        // Check for existing referral on the same day
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
            throw new Error("Referral already exists for today.");
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
        Sentry.captureException(error);
        console.error("Error creating referral:", error);
        throw new Error("Failed to create referral.");
    }
}
