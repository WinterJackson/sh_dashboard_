// src/lib/data-access/referrals/data.ts

"use server";

import {
    Referral,
    ReferralStatus,
    ReferralType,
    Role,
} from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

import prisma from "@/lib/prisma";


export async function fetchInwardReferralsOverview() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/sign-in");

  const { role, hospitalId } = session.user;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);

  const filters =
    role !== Role.SUPER_ADMIN && hospitalId !== null
      ? { destinationHospitalId: hospitalId }
      : {};

  const [todayReferrals, currentWeekReferrals, previousWeekReferrals] = await Promise.all([
    prisma.referral.findMany({
      where: {
        ...filters,
        effectiveDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: { patientId: true },
    }),
    prisma.referral.findMany({
      where: {
        ...filters,
        effectiveDate: {
          gte: weekAgo,
          lt: today,
        },
      },
      select: { patientId: true },
    }),
    prisma.referral.findMany({
      where: {
        ...filters,
        effectiveDate: {
          gte: twoWeeksAgo,
          lt: weekAgo,
        },
      },
      select: { patientId: true },
    }),
  ]);

  const getUniquePatientCount = (data: { patientId: number }[]) => {
    const ids = new Set(data.map((r) => r.patientId));
    return ids.size;
  };

  const currentPatientCount = getUniquePatientCount(currentWeekReferrals);
  const previousPatientCount = getUniquePatientCount(previousWeekReferrals);

  const percentageChange =
    previousPatientCount > 0 ? ((currentPatientCount - previousPatientCount) / previousPatientCount) * 100 : null;

  const patientDelta = currentPatientCount - previousPatientCount;

  return {
    inwardReferralsToday: todayReferrals.length,
    percentageChange,
    patientDelta,
  };
}

export async function fetchOutwardReferralsOverview() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/sign-in");

  const { role, hospitalId } = session.user;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);

  const filters =
    role !== Role.SUPER_ADMIN && hospitalId !== null
      ? { originHospitalId: hospitalId }
      : {};

  const [todayReferrals, currentWeekReferrals, previousWeekReferrals] = await Promise.all([
    prisma.referral.findMany({
      where: {
        ...filters,
        effectiveDate: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: { patientId: true },
    }),
    prisma.referral.findMany({
      where: {
        ...filters,
        effectiveDate: {
          gte: weekAgo,
          lt: today,
        },
      },
      select: { patientId: true },
    }),
    prisma.referral.findMany({
      where: {
        ...filters,
        effectiveDate: {
          gte: twoWeeksAgo,
          lt: weekAgo,
        },
      },
      select: { patientId: true },
    }),
  ]);

  const getUniquePatientCount = (data: { patientId: number }[]) => {
    const ids = new Set(data.map((r) => r.patientId));
    return ids.size;
  };

  const currentPatientCount = getUniquePatientCount(currentWeekReferrals);
  const previousPatientCount = getUniquePatientCount(previousWeekReferrals);

  const percentageChange =
    previousPatientCount > 0 ? ((currentPatientCount - previousPatientCount) / previousPatientCount) * 100 : null;

  const patientDelta = currentPatientCount - previousPatientCount;

  return {
    outwardReferralsToday: todayReferrals.length,
    percentageChange,
    patientDelta,
  };
}


/**
 * Fetches inward referrals based on user role and hospitalId.
 */
export const fetchInwardReferrals = async (user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<Referral[]> => {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null, // Use null coalescing for undefined values
        };
    }

    const { role, hospitalId } = user;

    try {
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all referrals
                whereClause = {
                    OR: [
                        { type: "UPWARD" },
                        { type: "DOWNWARD" },
                        { type: "LATERAL" },
                        { type: "EMERGENCY" },
                    ],
                };
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Filter by destinationHospitalId for other roles
                whereClause = {
                    destinationHospitalId: hospitalId,
                    OR: [
                        { type: "UPWARD" },
                        { type: "DOWNWARD" },
                        { type: "LATERAL" },
                        { type: "EMERGENCY" },
                    ],
                };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch referrals based on the filter criteria
        return await prisma.referral.findMany({
            where: whereClause,
            include: {
                patient: true,
                originHospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
                destinationHospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
                referringDoctor: {
                    select: {
                        doctorId: true,
                        userId: true,
                    },
                },
            },
        });
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Error fetching inward referrals:", errorMessage);
        return [];
    }
};

/**
 * Fetches the count of inward referrals based on user role and hospitalId.
 */
export const fetchInwardReferralsCount = async (user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<number> => {
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
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all referrals
                whereClause = {
                    OR: [
                        { type: "UPWARD" },
                        { type: "DOWNWARD" },
                        { type: "LATERAL" },
                        { type: "EMERGENCY" },
                    ],
                };
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Filter by destinationHospitalId for other roles
                whereClause = {
                    destinationHospitalId: hospitalId,
                    OR: [
                        { type: "UPWARD" },
                        { type: "DOWNWARD" },
                        { type: "LATERAL" },
                        { type: "EMERGENCY" },
                    ],
                };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch referrals count based on the filter criteria
        return await prisma.referral.count({
            where: whereClause,
        });
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Error fetching inward referrals count:", errorMessage);
        return 0;
    }
};

/**
 * Fetches outward referrals based on user role and hospitalId.
 */
export const fetchOutwardReferrals = async (user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<Referral[]> => {
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
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all outward referrals
                whereClause = {
                    OR: [
                        { type: "UPWARD" },
                        { type: "DOWNWARD" },
                        { type: "LATERAL" },
                        { type: "EMERGENCY" },
                    ],
                    originHospitalId: { not: undefined },
                };
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Filter by originHospitalId for other roles
                whereClause = {
                    originHospitalId: hospitalId,
                    OR: [
                        { type: "UPWARD" },
                        { type: "DOWNWARD" },
                        { type: "LATERAL" },
                        { type: "EMERGENCY" },
                    ],
                };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch referrals based on the filter criteria
        return await prisma.referral.findMany({
            where: whereClause,
            include: {
                patient: true,
                originHospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
                destinationHospital: {
                    select: {
                        hospitalId: true,
                        hospitalName: true,
                    },
                },
                referringDoctor: {
                    select: {
                        doctorId: true,
                        userId: true,
                    },
                },
            },
        });
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, user } });
        console.error("Error fetching outward referrals:", errorMessage);
        return [];
    }
};

/**
 * Fetches the count of outward referrals based on user role and hospitalId.
 */
export const fetchOutwardReferralsCount = async (user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<number> => {
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
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (role) {
            case "SUPER_ADMIN":
                // No additional filtering for SUPER_ADMIN, see all outward referrals
                whereClause = {
                    OR: [
                        { type: "UPWARD" },
                        { type: "DOWNWARD" },
                        { type: "LATERAL" },
                        { type: "EMERGENCY" },
                    ],
                    originHospitalId: { not: undefined },
                };
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Filter by originHospitalId for other roles
                whereClause = {
                    originHospitalId: hospitalId,
                    OR: [
                        { type: "UPWARD" },
                        { type: "DOWNWARD" },
                        { type: "LATERAL" },
                        { type: "EMERGENCY" },
                    ],
                };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch referrals count based on the filter criteria
        return await prisma.referral.count({
            where: whereClause,
        });
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
        county?: string;
        phoneNo: string;
        email: string;
        referringDoctorName: string;
        departmentName: string;
        specializationName: string;
        referringDoctorEmail: string;
        referringDoctorPhoneNo: string;
        hospitalName: string;
        type: ReferralType;
        primaryCareProvider: string;
        referralAddress: string;
        referralPhone: string;
        reasonForConsultation: string;
        diagnosis: string;
        status: ReferralStatus;
    },
    user?: { role: Role; hospitalId: number | null }
): Promise<Referral | null> {
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
        };
    }

    const { hospitalId: userHospitalId } = user;

    try {
        // Validate hospital existence
        const hospital = await prisma.hospital.findUnique({
            where: { hospitalName: data.hospitalName },
        });

        if (!hospital || !hospital.hospitalId) {
            console.error(
                `Hospital with name '${data.hospitalName}' not found.`
            );
            return null;
        }

        const hospitalId = userHospitalId ?? hospital.hospitalId;

        // Upsert the patient
        const patient = await prisma.patient.upsert({
            where: { patientId: data.patientId },
            update: {
                firstName: data.patientName.split(" ")[0],
                lastName:
                    data.patientName.split(" ").slice(1).join(" ") || null,
                gender: data.gender,
                dateOfBirth: new Date(data.dateOfBirth),
                address: data.homeAddress || null,
                county: data.county || null,
                phoneNo: data.phoneNo,
                email: data.email,
                reasonForConsultation: data.reasonForConsultation,
                status: data.status,
                hospitalId,
            },
            create: {
                firstName: data.patientName.split(" ")[0],
                lastName:
                    data.patientName.split(" ").slice(1).join(" ") || null,
                gender: data.gender,
                dateOfBirth: new Date(data.dateOfBirth),
                address: data.homeAddress || null,
                county: data.county || null,
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
                originHospitalId: hospitalId,
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

        // Fetch referring doctor details
        const referringDoctor = await prisma.doctor.findFirst({
            where: {
                userId: {
                    in: await prisma.user
                        .findMany({
                            where: { email: data.referringDoctorEmail },
                            select: { userId: true },
                        })
                        .then((users: any[]) => users.map((u) => u.userId)),
                },
            },
        });

        if (!referringDoctor) {
            console.error("Referring doctor not found.");
            return null;
        }

        // Create the referral
        const newReferral = await prisma.referral.create({
            data: {
                patientId: patient.patientId,
                referringDoctorId: referringDoctor.doctorId,
                originHospitalId: hospitalId,
                destinationHospitalId: hospitalId,
                previousReferralId: null,
                type: data.type,
                status: data.status,
                priority: "ROUTINE",
                urgency: "Medium",
                isTransportRequired: false,
                effectiveDate: new Date(),
                diagnosis: data.diagnosis,
                reasonForConsultation: data.reasonForConsultation,
                primaryCareProvider: data.primaryCareProvider,
                referralAddress: data.referralAddress,
                referralPhone: data.referralPhone,
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
