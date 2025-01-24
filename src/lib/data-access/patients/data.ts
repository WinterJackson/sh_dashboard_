// src/lib/data-access/patients/data.ts

"use server";

import { Patient, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

// Fetch today's patients
export async function fetchPatientsToday(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ patients: Patient[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { patients: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    const { role, hospitalId, userId } = user;

    try {
        // Define the filter clause based on the user role
        let whereClause: Record<string, any> = {};

        switch (role) {
            case "SUPER_ADMIN":
                whereClause = {};
                break;
            case "ADMIN":
                if (hospitalId === null) {
                    console.error(
                        "Admins must have an associated hospital ID."
                    );
                    return { patients: [] };
                }
                whereClause = { hospitalId };
                break;
            case "DOCTOR":
                if (!userId) {
                    console.error("Doctors must have a valid user ID.");
                    return { patients: [] };
                }
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    console.error("Doctor not found for the given user ID.");
                    return { patients: [] };
                }
                whereClause = { doctorId: doctor.doctorId };
                break;
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    console.error(
                        `${role}s must have an associated hospital ID.`
                    );
                    return { patients: [] };
                }
                whereClause = { hospitalId };
                break;
            default:
                console.error("Invalid role provided.");
                return { patients: [] };
        }

        // Date filters for "today"
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Fetch unique patients for today
        const appointments = await prisma.appointment.findMany({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            select: {
                patient: true,
            },
        });

        // Specify the type of appointments and map patients to enforce types
        const uniquePatients = Array.from(
            new Map(
                appointments.map((a: { patient: { patientId: any } }) => [
                    a.patient.patientId,
                    a.patient,
                ])
            ).values()
        ) as Patient[];

        return { patients: uniquePatients };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch patients:", errorMessage);
        return { patients: [] };
    }
}

// Fetch today's patients count
export async function fetchPatientsTodayCount(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
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
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    const { role, hospitalId, userId } = user;

    try {
        // Define the filter clause based on the user role
        let whereClause = {};

        switch (role) {
            case "SUPER_ADMIN":
                whereClause = {};
                break;

            case "ADMIN":
                if (hospitalId === null) {
                    console.error(
                        "Admins must have an associated hospital ID."
                    );
                    return 0;
                }
                whereClause = { hospitalId };
                break;

            case "DOCTOR":
                if (!userId) {
                    console.error("Doctors must have a valid user ID.");
                    return 0;
                }
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    console.error("Doctor not found for the given user ID.");
                    return 0;
                }
                whereClause = { doctorId: doctor.doctorId };
                break;

            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    console.error(
                        `${role}s must have an associated hospital ID.`
                    );
                    return 0;
                }
                whereClause = { hospitalId };
                break;

            default:
                console.error("Invalid role provided.");
                return 0;
        }

        // Date filters for "today"
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        // Count unique patients for today
        const appointments = await prisma.appointment.findMany({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            select: {
                patientId: true,
            },
        });

        // Use a Set to ensure unique patient IDs
        const uniquePatientCount = new Set(
            appointments.map((a: { patientId: any }) => a.patientId)
        ).size;

        return uniquePatientCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch patients count:", errorMessage);
        return 0;
    }
}

// Fetch patients for the last 14 days
export async function fetchPatientsForLast14Days(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{
    currentWeekPatients: Patient[];
    previousWeekPatients: Patient[];
}> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { currentWeekPatients: [], previousWeekPatients: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    const { role, hospitalId, userId } = user;

    try {
        let whereClause: Record<string, any> = {};

        switch (role) {
            case "SUPER_ADMIN":
                whereClause = {};
                break;
            case "ADMIN":
                if (hospitalId === null) {
                    console.error(
                        "Admins must have an associated hospital ID."
                    );
                    return {
                        currentWeekPatients: [],
                        previousWeekPatients: [],
                    };
                }
                whereClause = { hospitalId };
                break;
            case "DOCTOR":
                if (!userId) {
                    console.error("Doctors must have a valid user ID.");
                    return {
                        currentWeekPatients: [],
                        previousWeekPatients: [],
                    };
                }
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    console.error("Doctor not found for the given user ID.");
                    return {
                        currentWeekPatients: [],
                        previousWeekPatients: [],
                    };
                }
                whereClause = { doctorId: doctor.doctorId };
                break;
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    console.error(
                        `${role}s must have an associated hospital ID.`
                    );
                    return {
                        currentWeekPatients: [],
                        previousWeekPatients: [],
                    };
                }
                whereClause = { hospitalId };
                break;
            default:
                console.error("Invalid role provided.");
                return { currentWeekPatients: [], previousWeekPatients: [] };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);

        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 13);

        // Fetch patients for the current week
        const currentWeekAppointments = await prisma.appointment.findMany({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: sevenDaysAgo,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
            select: {
                patient: true,
            },
        });

        // Fetch patients for the previous week
        const previousWeekAppointments = await prisma.appointment.findMany({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: fourteenDaysAgo,
                    lt: sevenDaysAgo,
                },
            },
            select: {
                patient: true,
            },
        });

        // Ensure unique patients for each week using a Map
        const currentWeekPatients = Array.from(
            new Map(
                currentWeekAppointments.map(
                    (a: { patient: { patientId: any } }) => [
                        a.patient.patientId,
                        a.patient,
                    ]
                )
            ).values()
        ) as Patient[];

        const previousWeekPatients = Array.from(
            new Map(
                previousWeekAppointments.map(
                    (a: { patient: { patientId: any } }) => [
                        a.patient.patientId,
                        a.patient,
                    ]
                )
            ).values()
        ) as Patient[];

        return {
            currentWeekPatients,
            previousWeekPatients,
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(
            "Failed to fetch patients for the last 14 days:",
            errorMessage
        );
        return { currentWeekPatients: [], previousWeekPatients: [] };
    }
}

/**
 * Fetch patients based on user role and hospital association.
 * @param user - User's role, hospital ID, and user ID.
 * @returns Patients and total count.
 */
export async function fetchPatients(user?: {
    role: Role;
    hospitalId?: number | null;
    userId?: string | null;
}): Promise<{ patients: Patient[]; totalPatients: number }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { patients: [], totalPatients: 0 };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    const { role, hospitalId, userId } = user;

    try {
        let patients: Patient[] = [];
        let totalPatients: number = 0;

        switch (role) {
            case "SUPER_ADMIN":
                patients = await prisma.patient.findMany({
                    include: {
                        hospital: true,
                        appointments: { orderBy: { appointmentDate: "desc" } },
                    },
                });
                totalPatients = await prisma.patient.count();
                break;

            case "ADMIN":
            case "NURSE":
            case "STAFF":
                if (!hospitalId) {
                    console.error(`${role} must have a valid hospital ID.`);
                    return { patients: [], totalPatients: 0 };
                }

                patients = await prisma.patient.findMany({
                    where: { hospitalId },
                    include: {
                        hospital: true,
                        appointments: { orderBy: { appointmentDate: "desc" } },
                    },
                });

                totalPatients = await prisma.patient.count({
                    where: { hospitalId },
                });
                break;

            case "DOCTOR":
                if (!hospitalId || !userId) {
                    console.error(
                        "Doctors must have a valid hospital ID and user ID."
                    );
                    return { patients: [], totalPatients: 0 };
                }

                patients = await prisma.patient.findMany({
                    where: {
                        hospitalId,
                        appointments: { some: { doctor: { userId } } },
                    },
                    include: {
                        hospital: true,
                        appointments: {
                            where: { doctor: { userId } },
                            orderBy: { appointmentDate: "desc" },
                        },
                    },
                });

                totalPatients = await prisma.patient.count({
                    where: {
                        hospitalId,
                        appointments: { some: { doctor: { userId } } },
                    },
                });
                break;

            default:
                console.error("Invalid role provided.");
                return { patients: [], totalPatients: 0 };
        }

        const sortedPatients = patients.sort((a, b) => {
            const aLatestAppointment = a.appointments[0]?.appointmentDate ?? 0;
            const bLatestAppointment = b.appointments[0]?.appointmentDate ?? 0;
            return (
                new Date(bLatestAppointment).getTime() -
                new Date(aLatestAppointment).getTime()
            );
        });

        return { patients: sortedPatients, totalPatients };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching patients:", errorMessage);
        return { patients: [], totalPatients: 0 };
    }
}

// Fetch patients details using the patient name
export async function fetchPatientDetails(
    name: string,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Patient | null> {
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

    const { role, hospitalId } = user;

    try {
        let whereClause: Record<string, any> = { name };

        // Apply role-based restrictions if necessary
        switch (role) {
            case "SUPER_ADMIN":
                // No additional restrictions for SUPER_ADMIN
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (!hospitalId) {
                    console.error(
                        `${role}s must have an associated hospital ID.`
                    );
                    return null;
                }
                whereClause.hospitalId = hospitalId;
                break;

            default:
                console.error("Invalid role provided.");
                return null;
        }

        const patient = await prisma.patient.findFirst({
            where: whereClause,
            include: { hospital: true },
        });

        if (!patient) {
            console.warn(`Patient '${name}' not found.`);
            return null;
        }

        return patient;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch patient details:", errorMessage);
        return null;
    }
}

/**
 * Fetch patients based on the user's role and hospital ID.
 * @param user - User's role, hospital ID, and user ID.
 * @returns Array of patients.
 */
export async function fetchPatientsByRole(user?: {
    role: Role;
    hospitalId: number | null;
}): Promise<Patient[]> {
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
        let whereClause: Record<string, any> = {};

        switch (role) {
            case "SUPER_ADMIN":
                // Fetch all patients for SUPER_ADMIN
                whereClause = {};
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                // Fetch patients only for the user's hospital
                if (!hospitalId) {
                    console.error(
                        `${role}s must have an associated hospital ID.`
                    );
                    return [];
                }
                whereClause = { hospitalId };
                break;

            default:
                console.error("Invalid role provided.");
                return [];
        }

        // Fetch patients based on the whereClause
        const patients = await prisma.patient.findMany({
            where: whereClause,
            include: {
                hospital: true,
                appointments: {
                    orderBy: { appointmentDate: "desc" }, // Sort appointments by date
                },
            },
        });

        return patients;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch patients by role:", errorMessage);
        return [];
    }
}

// delete multiple patients
export async function deletePatients(
    patientIds: number[],
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<{ success: boolean; message?: string }> {
    if (!user) {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
            return { success: false, message: "Unauthorized" };
        }
        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    const { role, hospitalId } = user;

    try {
        if (patientIds.length === 0) {
            throw new Error("No patient IDs provided");
        }

        const whereClause: any = {
            patientId: { in: patientIds },
            ...(role !== "SUPER_ADMIN" && hospitalId && { hospitalId }),
        };

        // Verify existence first for better error handling
        const existingPatients = await prisma.patient.findMany({
            where: whereClause,
            select: { patientId: true },
        });

        if (existingPatients.length !== patientIds.length) {
            throw new Error("Some patients not found or unauthorized");
        }

        // Perform deletion in transaction
        await prisma.$transaction([
            prisma.patient.deleteMany({
                where: whereClause,
            }),
        ]);

        return { success: true };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: {
                errorMessage,
                patientIds,
                userRole: user.role,
                hospitalId: user.hospitalId,
            },
        });
        console.error("Patient deletion failed:", errorMessage);
        return { success: false, message: errorMessage };
    }
}
