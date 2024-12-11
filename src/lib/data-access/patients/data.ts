// src/lib/data-access/patients/data.ts

"use server";

import { Patient, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");


// Fetch today's patients
export async function fetchPatientsToday(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ patients: Patient[] }> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
    }

    try {
        const { role, hospitalId, userId } = user;

        // Define the filter clause based on the user role
        let whereClause: Record<string, any> = {};

        switch (role) {
            case "SUPER_ADMIN":
                whereClause = {};
                break;
            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                whereClause = { hospitalId };
                break;
            case "DOCTOR":
                if (!userId) {
                    throw new Error("Doctors must have a valid user ID.");
                }
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    throw new Error("Doctor not found for the given user ID.");
                }
                whereClause = { doctorId: doctor.doctorId };
                break;
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                whereClause = { hospitalId };
                break;
            default:
                throw new Error("Invalid role provided.");
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
        Sentry.captureException(error);
        throw new Error(`Failed to fetch patients: ${error}`);
    }
}


// Fetch today's patients count
export async function fetchPatientsTodayCount(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<number> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
    }

    try {
        const { role, hospitalId, userId } = user;

        // Define the filter clause based on the user role
        let whereClause = {};

        switch (role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN
                whereClause = {};
                break;

            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                // Admins count patients for their associated hospital
                whereClause = { hospitalId };
                break;

            case "DOCTOR":
                if (!userId) {
                    throw new Error("Doctors must have a valid user ID.");
                }
                // Fetch the `doctorId` associated with the `userId`
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    throw new Error("Doctor not found for the given user ID.");
                }
                // Doctors count only their own patients
                whereClause = { doctorId: doctor.doctorId };
                break;

            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                // Nurses and Staff count patients for their associated hospital
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
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
        Sentry.captureException(error);
        throw new Error(`Failed to fetch patients count: ${error}`);
    }
}


// Fetch patients for the last 14 days
export async function fetchPatientsForLast14Days(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ currentWeekPatients: Patient[]; previousWeekPatients: Patient[] }> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
    }

    try {
        const { role, hospitalId, userId } = user;

        let whereClause: Record<string, any> = {};

        switch (role) {
            case "SUPER_ADMIN":
                whereClause = {};
                break;
            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                whereClause = { hospitalId };
                break;
            case "DOCTOR":
                if (!userId) {
                    throw new Error("Doctors must have a valid user ID.");
                }
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    throw new Error("Doctor not found for the given user ID.");
                }
                whereClause = { doctorId: doctor.doctorId };
                break;
            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                whereClause = { hospitalId };
                break;
            default:
                throw new Error("Invalid role provided.");
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
        Sentry.captureException(error);
        throw new Error(`Failed to fetch patients for the last 14 days: ${error}`);
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

        if (!session || !session.user) {
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
                    throw new Error(`${role} must have a valid hospital ID.`);
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
                    throw new Error("Doctors must have a valid hospital ID and user ID.");
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
                throw new Error("Invalid role provided.");
        }

        // Sort patients by their latest appointment date manually
        const sortedPatients = patients.sort((a, b) => {
            const aLatestAppointment = a.appointments[0]?.appointmentDate ?? 0;
            const bLatestAppointment = b.appointments[0]?.appointmentDate ?? 0;
            return new Date(bLatestAppointment).getTime() - new Date(aLatestAppointment).getTime();
        });

        return { patients: sortedPatients, totalPatients };
    } catch (error) {
        // Log the error with Sentry and rethrow
        Sentry.captureException(error);
        console.error(`Error fetching patients: ${error}`);
        throw new Error(`Failed to fetch patients: ${error}`);
    }
}