// src/lib/data-access/appointments/data.ts

"use server";

import { Appointment, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

export async function fetchAppointments(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ appointments: Appointment[]; totalAppointments: number }> {
    
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { appointments: [], totalAppointments: 0 };
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
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch appointments:", errorMessage);
        return { appointments: [], totalAppointments: 0 };
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
    },
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Appointment | null> {
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

    try {
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
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error updating appointment details:", errorMessage);
        return null;
    }
}

// Update appointment status
export async function updateAppointmentStatus(
    appointmentId: string,
    updateData: { status: string; reason: string },
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Appointment | null> {

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

    if (!appointmentId || !updateData) {
        console.error("Appointment ID and update data are required.");
        return null;
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
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(`Error updating appointment status for ${appointmentId}:`, errorMessage);
        return null;
    }
}

// Update appointment type
export async function updateAppointmentType(
    appointmentId: string,
    newType: string,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<{ success: boolean; updatedType?: string }> {

    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { success: false };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    if (!appointmentId || !newType) {
        console.error("Appointment ID and new type are required.");
        return { success: false };
    }

    try {
        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId },
            data: { type: newType },
        });

        return { success: true, updatedType: updatedAppointment.type };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(`Error updating appointment type for ${appointmentId}:`, errorMessage);
        return { success: false };
    }
}


export async function fetchAppointmentsToday(
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<{ appointments: Appointment[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { appointments: [] };
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
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(`Failed to fetch appointments:`, errorMessage);
        return { appointments: [] };
    }
}


export async function fetchAppointmentsTodayCount(
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<number> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return 0;
        }

        // Ensure the `user` object matches the expected type
        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
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
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(`Failed to fetch appointment count for today:`, errorMessage);
        return 0;
    }
}


export async function fetchAppointmentsForLast14Days(
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<{ appointments: Appointment[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { appointments: [] };
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
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(`Error fetching appointments for the last 14 days:`, errorMessage);
        return { appointments: [] };
    }
}


export async function fetchAppointmentsForLast14DaysCount(
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<{ count: number }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { count: 0 };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId,
            userId: session.user.id,
        };
    }

    const { role, hospitalId, userId } = user;

    try {
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
                const doctor = await prisma.doctor.findUnique({ where: { userId } });
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
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch appointment count for the last 14 days:", errorMessage);
        return { count: 0 };
    }
}
