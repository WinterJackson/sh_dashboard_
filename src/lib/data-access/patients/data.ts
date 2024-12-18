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
export async function fetchPatientsToday(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ patients: Patient[] }> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return { patients: [] }
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
                    console.error("Admins must have an associated hospital ID.");
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
                    console.error(`${role}s must have an associated hospital ID.`);
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
                appointments.map((a: { patient: { patientId: any; }; }) => [a.patient.patientId, a.patient])
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
export async function fetchPatientsTodayCount(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<number> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return 0;
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
                    console.error("Admins must have an associated hospital ID.");
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
                    console.error(`${role}s must have an associated hospital ID.`);
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
        const uniquePatientCount = new Set(appointments.map((a: { patientId: any; }) => a.patientId)).size;

        return uniquePatientCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch patients count:", errorMessage);
        return 0;
    }
}


// Fetch patients for the last 14 days
export async function fetchPatientsForLast14Days(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ currentWeekPatients: Patient[]; previousWeekPatients: Patient[] }> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return { currentWeekPatients: [], previousWeekPatients: [] };
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
                    console.error("Admins must have an associated hospital ID.");
                    return { currentWeekPatients: [], previousWeekPatients: [] };
                }
                whereClause = { hospitalId };
                break;
            case "DOCTOR":
                if (!userId) {
                    console.error("Doctors must have a valid user ID.");
                    return { currentWeekPatients: [], previousWeekPatients: [] };
                }
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    console.error("Doctor not found for the given user ID.");
                    return { currentWeekPatients: [], previousWeekPatients: [] };
                }
                whereClause = { doctorId: doctor.doctorId };
                break;
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    console.error(`${role}s must have an associated hospital ID.`);
                    return { currentWeekPatients: [], previousWeekPatients: [] };
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
                currentWeekAppointments.map((a: { patient: { patientId: any; }; }) => [a.patient.patientId, a.patient])
            ).values()
        ) as Patient[];

        const previousWeekPatients = Array.from(
            new Map(
                previousWeekAppointments.map((a: { patient: { patientId: any; }; }) => [a.patient.patientId, a.patient])
            ).values()
        ) as Patient[];

        return {
            currentWeekPatients,
            previousWeekPatients,
        };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch patients for the last 14 days:", errorMessage);
        return { currentWeekPatients: [], previousWeekPatients: [] };
    }
}


/**
 * Fetch patients based on user role and hospital association.
 * @param user - User's role, hospital ID, and user ID.
 * @returns Patients and total count.
 */
export async function fetchPatients(user: { role: Role; hospitalId?: number | null; userId?: string | null }): Promise<{ patients: Patient[]; totalPatients: number }> {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            redirect("/sign-in");
            return { patients: [], totalPatients: 0 };
        }

        const { role, hospitalId, userId } = user;

        let patients: Patient[] = [];
        let totalPatients: number = 0;

        switch (role) {
            case "SUPER_ADMIN":
                // Fetch all patients for super admin
                patients = await prisma.patient.findMany({
                    include: {
                        hospital: true,
                        appointments: {
                            orderBy: {
                                appointmentDate: "desc", // Sort appointments within each patient
                            },
                        },
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

                // Fetch patients associated with the specific hospital
                patients = await prisma.patient.findMany({
                    where: { hospitalId },
                    include: {
                        hospital: true,
                        appointments: {
                            orderBy: {
                                appointmentDate: "desc", // Sort appointments within each patient
                            },
                        },
                    },
                });

                totalPatients = await prisma.patient.count({
                    where: { hospitalId },
                });
                break;

            case "DOCTOR":
                if (!hospitalId || !userId) {
                    console.error("Doctors must have a valid hospital ID and user ID.");
                    return { patients: [], totalPatients: 0 };
                }

                // Fetch patients associated with the doctor
                patients = await prisma.patient.findMany({
                    where: {
                        hospitalId,
                        appointments: {
                            some: {
                                doctor: {
                                    userId,
                                },
                            },
                        },
                    },
                    include: {
                        hospital: true,
                        appointments: {
                            where: {
                                doctor: {
                                    userId, // Filter appointments to the doctor
                                },
                            },
                            orderBy: {
                                appointmentDate: "desc", // Sort appointments within each patient
                            },
                        },
                    },
                });

                totalPatients = await prisma.patient.count({
                    where: {
                        hospitalId,
                        appointments: {
                            some: {
                                doctor: {
                                    userId,
                                },
                            },
                        },
                    },
                });
                break;

            default:
                console.error("Invalid role provided.");
                return { patients: [], totalPatients: 0 };
        }

        // Sort patients by their latest appointment date manually
        const sortedPatients = patients.sort((a, b) => {
            const aLatestAppointment = a.appointments[0]?.appointmentDate ?? 0;
            const bLatestAppointment = b.appointments[0]?.appointmentDate ?? 0;
            return new Date(bLatestAppointment).getTime() - new Date(aLatestAppointment).getTime();
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
export async function fetchPatientDetails(name: string) {

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    try {
        const patient = await prisma.patient.findUnique({
            where: { name },
            include: {
                hospital: true,
            },
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
