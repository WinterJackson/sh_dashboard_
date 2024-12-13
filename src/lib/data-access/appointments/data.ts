// src/lib/data-access/appointments/data.ts

"use server";

import { Appointment, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");

export async function fetchAppointments(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ appointments: Appointment[]; totalAppointments: number }> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
    }

    try {
        const { role, hospitalId, userId } = user;

        // Define the filter clause based on the user role
        let whereClause = {};

        switch (role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all appointments
                whereClause = {};
                break;

            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                // Admins see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            case "DOCTOR":
                if (!userId) {
                    throw new Error("Doctors must have a valid user ID.");
                }
                // Fetch doctorId associated with the userId
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    throw new Error("Doctor not found for the given user ID.");
                }
                // Doctors see only their own appointments
                whereClause = { doctorId: doctor.doctorId };
                break;

            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                // Nurses and Staff see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch appointments
        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            include: {
                doctor: {
                    include: { user: { include: { profile: true } } },
                },
                patient: true,
                hospital: true,
            },
            orderBy: { appointmentDate: "desc" },
        });

        // Get the total count of appointments for pagination or informational purposes
        const totalAppointments = await prisma.appointment.count({
            where: whereClause,
        });

        return { appointments, totalAppointments };
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(`Failed to fetch appointments: ${error}`);
    }
}

/**
 * Handles rescheduling or updating an appointment.
 * @param appointmentId - The ID of the appointment to update.
 * @param updateData - Object containing update details (e.g., status, date, time, etc.).
 */
export async function updateAppointmentDetails(
    appointmentId: string,
    updateData: {
        date?: string;
        timeFrom?: string;
        timeTo?: string;
        doctorId?: number;
        hospitalId?: number;
        type?: string;
        status?: string;
    }
): Promise<Appointment | null> {
    try {
        if (!appointmentId || !updateData) {
            throw new Error("Appointment ID and update data are required.");
        }

        const updateFields: any = {};

        // Handle rescheduling logic
        if (updateData.date && updateData.timeFrom && updateData.timeTo) {
            const appointmentDate = new Date(updateData.date);
            const [hoursFrom, minutesFrom] = updateData.timeFrom.split(":");
            appointmentDate.setHours(parseInt(hoursFrom), parseInt(minutesFrom));

            const appointmentEndAt = new Date(updateData.date);
            const [hoursTo, minutesTo] = updateData.timeTo.split(":");
            appointmentEndAt.setHours(parseInt(hoursTo), parseInt(minutesTo));

            updateFields.appointmentDate = appointmentDate;
            updateFields.appointmentEndAt = appointmentEndAt;
        }

        if (updateData.doctorId) {
            updateFields.doctorId = updateData.doctorId;
        }
        if (updateData.hospitalId) {
            updateFields.hospitalId = updateData.hospitalId;
        }
        if (updateData.type) {
            updateFields.type = updateData.type;
        }
        if (updateData.status) {
            updateFields.status = updateData.status;
        }

        // Update the appointment in the database
        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId },
            data: updateFields,
        });

        return updatedAppointment;
    } catch (error) {
        Sentry.captureException(error);
        console.error("Error updating appointment details:", error);
        return null;
    }
}

// Update appointment status
export async function updateAppointmentStatus(
    appointmentId: string,
    updateData: { status: string; reason: string }
): Promise<Appointment | null> {

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
    }

    if (!appointmentId || !updateData) {
        throw new Error("Appointment ID and update data are required.");
    }

    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId },
            data: {
                status: updateData.status,
                cancellationReason:
                    updateData.status === "Cancelled" ? updateData.reason : undefined,
                pendingReason:
                    updateData.status === "Pending" ? updateData.reason : undefined,
            },
        });

        return updatedAppointment;
    } catch (error) {
        Sentry.captureException(error);
        console.error(`Error updating appointment status for ${appointmentId}:`, error);
        return null;
    }
}

// Update appointment type
export async function updateAppointmentType(
    appointmentId: string,
    newType: string
): Promise<{ success: boolean; updatedType?: string }> {

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
    }

    if (!appointmentId || !newType) {
        throw new Error("Appointment ID and new type are required.");
    }

    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId },
            data: { type: newType },
        });

        return { success: true, updatedType: updatedAppointment.type };
    } catch (error) {
        Sentry.captureException(error);
        console.error(`Error updating appointment type for ${appointmentId}:`, error);
        return { success: false };
    }
}


export async function fetchAppointmentsToday(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ appointments: Appointment[]; }> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
    }

    try {
        const { role, hospitalId, userId } = user;

        // Define the filter clause based on the user role
        let whereClause = {};

        switch (role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all appointments
                whereClause = {};
                break;

            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                // Admins see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            case "DOCTOR":
                if (!userId) {
                    throw new Error("Doctors must have a valid user ID.");
                }
                // Fetch doctorId associated with the userId
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    throw new Error("Doctor not found for the given user ID.");
                }
                // Doctors see only their own appointments
                whereClause = { doctorId: doctor.doctorId };
                break;

            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                // Nurses and Staff see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const appointments = await prisma.appointment.findMany({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            select: {
                appointmentDate: true,
                hospitalId: true,
            },
        });

        return { appointments };
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(`Failed to fetch appointments: ${error}`);
    }
}


export async function fetchAppointmentsTodayCount(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<number> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
    }

    try {
        const { role, hospitalId, userId } = user;

        // Define the filter clause based on the user role
        let whereClause = {};

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
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const appointmentsTodayCount = await prisma.appointment.count({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: today,
                    lt: tomorrow,
                },
            },
        });

        return appointmentsTodayCount;
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(`Failed to fetch appointment count for today: ${error}`);
    }
}


export async function fetchAppointmentsForLast14Days(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ appointments: Appointment[]; }> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
    }

    try {
        const { role, hospitalId, userId } = user;

        // Define the filter clause based on the user role
        let whereClause: any = {};

        switch (role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all appointments
                whereClause = {};
                break;

            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error("Admins must have an associated hospital ID.");
                }
                // Admins see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            case "DOCTOR":
                if (!userId) {
                    throw new Error("Doctors must have a valid user ID.");
                }
                // Fetch doctorId associated with the userId
                const doctor = await prisma.doctor.findUnique({
                    where: { userId },
                });
                if (!doctor) {
                    throw new Error("Doctor not found for the given user ID.");
                }
                // Doctors see only their own appointments
                whereClause = { doctorId: doctor.doctorId };
                break;

            case "NURSE":
            case "STAFF":
                if (hospitalId === null) {
                    throw new Error(`${role}s must have an associated hospital ID.`);
                }
                // Nurses and Staff see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Calculate date range
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 13);

        // Fetch appointments for the last 14 days
        const appointments = await prisma.appointment.findMany({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: fourteenDaysAgo,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Include today
                },
            },
            select: {
                appointmentDate: true,
                hospitalId: true,
            },
        });

        return { appointments };
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(`"Error fetching appointments for the last 14 days: ${error}`);
    }
}


export async function fetchAppointmentsForLast14DaysCount(user: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ count: number; }> {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
    }

    try {
        const { role, hospitalId, userId } = user;

        // Define the filter clause based on the user role
        let whereClause: any = {};

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
        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 13);

        const count = await prisma.appointment.count({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: fourteenDaysAgo,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                },
            },
        });

        return { count };
    } catch (error) {
        Sentry.captureException(error);
        throw new Error(`Failed to fetch appointment count for the last 14 days: ${error}`);
    }
}