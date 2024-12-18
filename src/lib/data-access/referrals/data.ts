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
    role: string,
    hospitalId: number | null
): Promise< Referral[] > => {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return [];
    }

    try {
        let inwardReferrals = []

        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all internal referrals for SUPER_ADMIN
            inwardReferrals = await prisma.referral.findMany({
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
            inwardReferrals = await prisma.referral.findMany({
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

        return inwardReferrals
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching inward referrals:", errorMessage);
        return [];
    }
};

export const fetchInwardReferralsCount = async (
    role: string,
    hospitalId: number | null
): Promise<number> => {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return 0;
    }

    try {
        let inwardReferralsCount = 0

        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all internal referrals for SUPER_ADMIN
            inwardReferralsCount = await prisma.referral.count({
                where: {
                    type: "Internal",
                },
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            inwardReferralsCount = await prisma.referral.count({
                where: {
                    type: "Internal",
                    hospitalId: hospitalId,
                },
            });
        }

        return inwardReferralsCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching inward referrals count:", errorMessage);
        return 0;
    }
};

export const fetchOutwardReferrals = async (
    role: string,
    hospitalId: number | null
): Promise< Referral[] > => {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return [];
    }

    try {
        let outwardReferrals = []

        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all external referrals for SUPER_ADMIN
            outwardReferrals = await prisma.referral.findMany({
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
            outwardReferrals = await prisma.referral.findMany({
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

        return outwardReferrals
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching outward referrals:", errorMessage);
        return [];
    }
};

export const fetchOutwardReferralsCount = async (
    role: string,
    hospitalId: number | null
): Promise<number> => {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return 0;
    }

    try {
        let outwardReferralsCount = 0

        // Filter based on role and hospitalId
        if (role === "SUPER_ADMIN") {
            // Fetch all external referrals for SUPER_ADMIN
            outwardReferralsCount = await prisma.referral.count({
                where: {
                    type: "External",
                },
            });
        } else if (hospitalId !== null) {
            // Fetch referrals for other roles filtered by hospitalId
            outwardReferralsCount = await prisma.referral.count({
                where: {
                    type: "External",
                    hospitalId: hospitalId,
                },
            });
        }

        return outwardReferralsCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching outward referrals count:", errorMessage);
        return 0;
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
}): Promise<any> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    try {
        // Find the hospital by name
        const hospital = await prisma.hospital.findUnique({
            where: { name: data.hospitalName },
        });

        if (!hospital) {
            console.error(`Hospital with name '${data.hospitalName}' not found.`);
            return null;
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
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error creating referral:", errorMessage);
        return null;
    }
}
