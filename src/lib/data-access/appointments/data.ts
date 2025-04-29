// src/lib/data-access/appointments/data.ts

"use server";

import { Appointment, Role, AppointmentStatus } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

const prisma = require("@/lib/prisma");

export async function fetchAppointments(
    user?: {
        role: Role;
        hospitalId: number | null;
        userId: string | null;
    },
    take?: number,
    skip?: number
): Promise<{ appointments: Appointment[]; totalAppointments: number }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
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
        let whereClause: any = {};

        // Add filtering logic based on user role here (e.g., SUPER_ADMIN, ADMIN, DOCTOR, etc.)
        switch (role) {
            case "SUPER_ADMIN":
                // No filtering needed for SUPER_ADMIN
                break;
            case "ADMIN":
            case "NURSE":
            case "STAFF":
                if (!hospitalId) {
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
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
            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch appointments with nested relations
        const appointments = await prisma.appointment.findMany({
            where: whereClause,
            include: {
                patient: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                doctor: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                hospital: true,
            },
            orderBy: {
                appointmentDate: "desc",
            },
            take,
            skip,
        });

        // Count total appointments for pagination
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

// Fetch appointment details by ID
export async function fetchAppointmentById(
    appointmentId: string,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Appointment | null> {
    if (!user) {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return null;
        }
        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    try {
        const appointment = await prisma.appointment.findUnique({
            where: { appointmentId },
            include: {
                patient: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                doctor: {
                    include: {
                        user: {
                            include: {
                                profile: true,
                            },
                        },
                    },
                },
                hospital: true,
            },
        });

        if (!appointment) {
            console.error(`Appointment with ID ${appointmentId} not found.`);
            return null;
        }

        // Ensure that the user has access to this appointment based on their role
        switch (user.role) {
            case "SUPER_ADMIN":
                break; // SUPER_ADMIN can access any appointment
            case "ADMIN":
            case "NURSE":
            case "STAFF":
                if (user.hospitalId !== appointment.hospitalId) {
                    throw new Error(
                        "You do not have permission to access this appointment."
                    );
                }
                break;
            case "DOCTOR":
                if (user.userId !== appointment.doctor?.userId) {
                    throw new Error(
                        "You do not have permission to access this appointment."
                    );
                }
                break;
            default:
                throw new Error("Invalid role provided.");
        }

        return appointment;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Error fetching appointment details:", errorMessage);
        return null;
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
        status?: AppointmentStatus;
    },
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Appointment | null> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
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
        const updateFields: Partial<Appointment> = {};

        if (updateData.date && updateData.timeFrom && updateData.timeTo) {
            const appointmentDate = new Date(updateData.date);
            const [hf, mf] = updateData.timeFrom.split(":"),
                [ht, mt] = updateData.timeTo.split(":");
            appointmentDate.setHours(parseInt(hf), parseInt(mf));

            const appointmentEndAt = new Date(updateData.date);
            appointmentEndAt.setHours(parseInt(ht), parseInt(mt));

            updateFields.appointmentDate = appointmentDate;
            updateFields.appointmentEndAt = appointmentEndAt;
        }

        if (updateData.doctorId !== undefined)
            updateFields.doctorId = updateData.doctorId;
        if (updateData.hospitalId !== undefined)
            updateFields.hospitalId = updateData.hospitalId;
        if (updateData.type !== undefined) updateFields.type = updateData.type;
        if (updateData.status !== undefined)
            updateFields.status = updateData.status;

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

// Update appointment type
export async function updateAppointmentType(
    appointmentId: string,
    newType: string,
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<{ success: boolean; updatedType?: string }> {
    if (!user) {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
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
            select: { type: true },
        });

        return { success: true, updatedType: updatedAppointment.type };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(
            `Error updating appointment type for ${appointmentId}:`,
            errorMessage
        );
        return { success: false };
    }
}

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
                    updateData.status === AppointmentStatus.CANCELLED
                        ? updateData.reason
                        : undefined,
                pendingReason:
                    updateData.status === AppointmentStatus.PENDING
                        ? updateData.reason
                        : undefined,
            },
        });

        return updatedAppointment;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(
            `Error updating appointment status for ${appointmentId}:`,
            errorMessage
        );
        return null;
    }
}

/**
 * Updates the reschedule status of an appointment.
 * @param appointmentId - The ID of the appointment to update.
 * @param updateData - Object containing update details (e.g., date, time, doctor, etc.).
 * @param user - The user making the request.
 */
export async function updateAppointmentStatusReschedule(
    appointmentId: string,
    updateData: {
        date: string;
        timeFrom?: string;
        timeTo?: string;
        doctorId: number;
        hospitalId: number;
        type: string;
    },
    user?: { role: Role; hospitalId: number | null; userId: string | null }
): Promise<Appointment | null> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return null;
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    try {
        const { date, timeFrom, timeTo, doctorId, hospitalId, type } =
            updateData;

        if (!date || !timeFrom || !timeTo) {
            console.error("Missing time data");
            throw new Error("Date, timeFrom, and timeTo are required.");
        }

        const appointmentDate = new Date(date);
        const [hf, mf] = timeFrom.split(":"),
            [ht, mt] = timeTo.split(":");
        appointmentDate.setHours(parseInt(hf, 10), parseInt(mf, 10));

        const appointmentEndAt = new Date(date);
        appointmentEndAt.setHours(parseInt(ht, 10), parseInt(mt, 10));

        const updatedAppointment = await prisma.appointment.update({
            where: { appointmentId },
            data: {
                appointmentDate,
                appointmentEndAt,
                doctorId,
                hospitalId,
                type,
                status: AppointmentStatus.RESCHEDULED,
            },
        });

        return updatedAppointment;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(
            "Error updating appointment reschedule status:",
            errorMessage
        );
        return null;
    }
}

export async function fetchAppointmentsToday(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ appointments: Appointment[] }> {
    // If user is not provided, fetch session data
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { appointments: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
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
                    throw new Error(
                        "Admins must have an associated hospital ID."
                    );
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
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Nurses and Staff see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Calculate today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

        // Fetch appointments for today based on the role and filter criteria
        const appointments = await prisma.appointment.findMany({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: today, // Greater than or equal to today
                    lt: tomorrow, // Less than tomorrow
                },
            },
            select: {
                appointmentId: true,
                appointmentDate: true,
                appointmentEndAt: true,
                status: true,
                type: true,
                hospitalId: true,
                doctorId: true,
                patientId: true,
                cancellationReason: true,
                pendingReason: true,
                createdAt: true,
                updatedAt: true,
                hospital: {
                    select: {
                        hospitalName: true,
                        hospitalId: true,
                    },
                },
                doctor: {
                    select: {
                        userId: true,
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
                patient: {
                    select: {
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        dateOfBirth: true,
                                    },
                                },
                            },
                        },
                        hospital: {
                            select: {
                                hospitalName: true,
                            },
                        },
                    },
                },
            },
        });

        return { appointments };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(`Failed to fetch appointments for today:`, errorMessage);
        return { appointments: [] };
    }
}

export async function fetchAppointmentsTodayCount(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<number> {
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
        let whereClause: any = {};

        switch (role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all appointments
                whereClause = {};
                break;

            case "ADMIN":
                if (hospitalId === null) {
                    throw new Error(
                        "Admins must have an associated hospital ID."
                    );
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
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Nurses and Staff see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Calculate today's date range
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

        // Count appointments for today based on the role and filter criteria
        const appointmentsTodayCount = await prisma.appointment.count({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: today, // Greater than or equal to today
                    lt: tomorrow, // Less than tomorrow
                },
            },
        });

        return appointmentsTodayCount;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(
            `Failed to fetch appointment count for today:`,
            errorMessage
        );
        return 0;
    }
}

export async function fetchAppointmentsForLast14Days(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ appointments: Appointment[] }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { appointments: [] };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null, // Use null coalescing for undefined values
            userId: session.user.id ?? null,
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
                    throw new Error(
                        "Admins must have an associated hospital ID."
                    );
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
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Nurses and Staff see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Calculate date range
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 13); // Start of 14 days ago

        // Fetch appointments for the last 14 days
        const appointments = await prisma.appointment.findMany({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: fourteenDaysAgo, // Greater than or equal to 14 days ago
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than tomorrow (end of today)
                },
            },
            select: {
                appointmentId: true,
                appointmentDate: true,
                appointmentEndAt: true,
                status: true,
                type: true,
                hospitalId: true,
                doctorId: true,
                patientId: true,
                cancellationReason: true,
                pendingReason: true,
                createdAt: true,
                updatedAt: true,
                hospital: {
                    select: {
                        hospitalName: true,
                        hospitalId: true,
                    },
                },
                doctor: {
                    select: {
                        userId: true,
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                    },
                                },
                            },
                        },
                    },
                },
                patient: {
                    select: {
                        user: {
                            select: {
                                profile: {
                                    select: {
                                        dateOfBirth: true,
                                    },
                                },
                            },
                        },
                        hospital: {
                            select: {
                                hospitalName: true,
                            },
                        },
                    },
                },
            },
        });

        return { appointments };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(
            `Error fetching appointments for the last 14 days:`,
            errorMessage
        );
        return { appointments: [] };
    }
}

export async function fetchAppointmentsForLast14DaysCount(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<{ count: number }> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return { count: 0 };
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
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
                    throw new Error(
                        "Admins must have an associated hospital ID."
                    );
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
                    throw new Error(
                        `${role}s must have an associated hospital ID.`
                    );
                }
                // Nurses and Staff see appointments for their associated hospital
                whereClause = { hospitalId };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Calculate date range
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today

        const fourteenDaysAgo = new Date(today);
        fourteenDaysAgo.setDate(today.getDate() - 13); // Start of 14 days ago

        // Count appointments for the last 14 days
        const count = await prisma.appointment.count({
            where: {
                ...whereClause,
                appointmentDate: {
                    gte: fourteenDaysAgo, // Greater than or equal to 14 days ago
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Less than tomorrow (end of today)
                },
            },
        });

        return { count };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error(
            "Failed to fetch appointment count for the last 14 days:",
            errorMessage
        );
        return { count: 0 };
    }
}
