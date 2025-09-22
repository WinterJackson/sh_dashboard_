// src/lib/data-access/patients/data.ts

"use server";

import { MedicalInformation, Patient, Role, FetchedPatient } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import prisma from "@/lib/prisma";


export async function fetchPatientsOverview() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const { role, hospitalId } = session.user;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - 6);

    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(today.getDate() - 13);

    const endOfLastWeek = new Date(today);
    endOfLastWeek.setDate(today.getDate() - 6);

    const filters = role !== Role.SUPER_ADMIN && hospitalId !== null ? { hospitalId } : {};

    const [todayPatients, currentWeekPatients, previousWeekPatients] = await Promise.all([
        prisma.appointment.findMany({
            where: {
                ...filters,
                appointmentDate: { gte: today, lt: tomorrow },
            },
            select: { patientId: true },
        }),
        prisma.appointment.findMany({
            where: {
                ...filters,
                appointmentDate: { gte: startOfThisWeek, lt: tomorrow },
            },
            select: { patientId: true },
        }),
        prisma.appointment.findMany({
            where: {
                ...filters,
                appointmentDate: { gte: startOfLastWeek, lt: endOfLastWeek },
            },
            select: { patientId: true },
        }),
    ]);

    const uniqueToday = new Set(todayPatients.map((a: { patientId: number }) => a.patientId)).size;
    const uniqueCurrentWeek = new Set(currentWeekPatients.map((a: { patientId: number }) => a.patientId)).size;
    const uniquePreviousWeek = new Set(previousWeekPatients.map((a: { patientId: number }) => a.patientId)).size;

    const percentageChange =
        uniquePreviousWeek > 0
            ? ((uniqueCurrentWeek - uniquePreviousWeek) / uniquePreviousWeek) * 100
            : null;

    return {
        patientsToday: uniqueToday,
        percentageChange,
    };
}

export type CreatePatientInput = {
    user: {
        username: string;
        email: string;
        password: string;
    };
    profile: {
        firstName: string;
        lastName: string;
        gender?: string;
        phoneNo?: string;
        address?: string;
        dateOfBirth?: string;
        cityOrTown?: string;
        county?: string;
        imageUrl?: string;
        nextOfKin?: string;
        nextOfKinPhoneNo?: string;
        emergencyContact?: string;
    };
    patient: {
        maritalStatus?: string;
        occupation?: string;
        nextOfKinName?: string;
        nextOfKinRelationship?: string;
        nextOfKinHomeAddress?: string;
        nextOfKinPhoneNo?: string;
        nextOfKinEmail?: string;
        reasonForConsultation: string;
        admissionDate?: string;
        dischargeDate?: string;
        status?: string;
    };
    medical: Partial<MedicalInformation>;
    hospitalId: number;
    createdByRole: Role;
};

export async function createPatient(
    input: CreatePatientInput
): Promise<Patient> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const {
        user: userData,
        profile: profileData,
        patient: patientData,
        medical: medicalData,
    } = input;

    try {
        const newPatient = await prisma.$transaction(
            async (tx: typeof prisma) => {
                const userRole = session?.user?.role as Role;

                // Determine effective hospitalId based on role
                const effectiveHospitalId =
                    userRole === Role.SUPER_ADMIN
                        ? input.hospitalId
                        : session?.user?.hospitalId;

                // Validate effective hospitalId is a positive integer
                if (
                    effectiveHospitalId === null ||
                    effectiveHospitalId === undefined ||
                    effectiveHospitalId < 1
                ) {
                    throw new Error("Valid hospital ID is required");
                }

                // Validate hospital exists
                const hospitalExists = await tx.hospital.findUnique({
                    where: { hospitalId: effectiveHospitalId },
                });

                if (!hospitalExists) {
                    throw new Error(
                        `Hospital with ID ${effectiveHospitalId} does not exist`
                    );
                }

                // Create user with effective hospitalId
                const createdUser = await tx.user.create({
                    data: {
                        username: userData.username,
                        email: userData.email,
                        password: userData.password,
                        role: Role.PATIENT,
                        hospitalId: effectiveHospitalId,
                    },
                });

                // Create profile
                await tx.profile.create({
                    data: {
                        userId: createdUser.userId,
                        firstName: profileData.firstName,
                        lastName: profileData.lastName,
                        gender: profileData.gender,
                        phoneNo: profileData.phoneNo,
                        address: profileData.address,
                        dateOfBirth: profileData.dateOfBirth
                            ? new Date(profileData.dateOfBirth)
                            : undefined,
                        cityOrTown: profileData.cityOrTown,
                        county: profileData.county,
                        imageUrl: profileData.imageUrl,
                        nextOfKin: profileData.nextOfKin,
                        nextOfKinPhoneNo: profileData.nextOfKinPhoneNo,
                        emergencyContact: profileData.emergencyContact,
                    },
                });

                // Create patient record
                const createdPatient = await tx.patient.create({
                    data: {
                        userId: createdUser.userId,
                        hospitalId: effectiveHospitalId,
                        maritalStatus: patientData.maritalStatus,
                        occupation: patientData.occupation,
                        nextOfKinName: patientData.nextOfKinName,
                        nextOfKinRelationship:
                            patientData.nextOfKinRelationship,
                        nextOfKinHomeAddress: patientData.nextOfKinHomeAddress,
                        nextOfKinPhoneNo: patientData.nextOfKinPhoneNo,
                        nextOfKinEmail: patientData.nextOfKinEmail,
                        reasonForConsultation:
                            patientData.reasonForConsultation,
                        admissionDate: patientData.admissionDate
                            ? new Date(patientData.admissionDate)
                            : undefined,
                        dischargeDate: patientData.dischargeDate
                            ? new Date(patientData.dischargeDate)
                            : undefined,
                        status: patientData.status ?? "Outpatient",
                    },
                });

                // Upsert medical information if provided
                if (Object.keys(medicalData).length > 0) {
                    await tx.medicalInformation.upsert({
                        where: {
                            patientId: createdPatient.patientId,
                        },
                        create: {
                            patientId: createdPatient.patientId,
                            ...medicalData,
                        },
                        update: medicalData,
                    });
                }

                return createdPatient;
            }
        );

        return newPatient;
    } catch (error) {
        const message = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: {
                createInput: input,
                errorMessage: message,
                hospitalId: input.hospitalId,
            },
        });

        throw new Error(`Failed to create patient: ${message}`);
    }
}

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
                patient: {
                    select: {
                        patientId: true,
                    },
                },
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
                patient: {
                    select: {
                        patientId: true,
                    },
                },
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
                patient: {
                    select: {
                        patientId: true,
                    },
                },
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
}): Promise<{ patients: FetchedPatient[]; totalPatients: number }> {
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
        let patients: FetchedPatient[] = [];
        let totalPatients: number = 0;

        const patientSelect = {
            patientId: true,
            hospitalId: true,
            reasonForConsultation: true,
            user: {
                select: {
                    email: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            phoneNo: true,
                            dateOfBirth: true,
                            gender: true,
                        },
                    },
                },
            },
            appointments: {
                select: {
                    appointmentDate: true,
                },
                orderBy: {
                    appointmentDate: "desc",
                },
            },
        };

        switch (role) {
            case "SUPER_ADMIN":
                patients = await prisma.patient.findMany({
                    select: patientSelect,
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
                    select: patientSelect,
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
                    select: patientSelect,
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

/**
 * Update basic patient information (marital status, occupation)
 * along with the user's profile (address, phoneNo) and email.
 */
export async function updateBasicInfo(
    patientId: number,
    data: {
        maritalStatus?: string;
        occupation?: string;
        address?: string;
        phoneNo?: string;
        email?: string;
    }
): Promise<Patient> {
    try {
        // Ensure the user is signed in
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            // Redirect to sign-in if not authenticated
            redirect("/sign-in");
            throw new Error("Not authenticated");
        }

        // Lookup patient to get userId
        const patient = await prisma.patient.findUnique({
            where: { patientId },
            select: { userId: true },
        });
        if (!patient) {
            throw new Error(`Patient with ID ${patientId} not found`);
        }
        const { userId } = patient;

        // Transactionally update patient, profile, and user records
        const [updatedPatient] = await prisma.$transaction([
            // Patient table
            prisma.patient.update({
                where: { patientId },
                data: {
                    maritalStatus: data.maritalStatus,
                    occupation: data.occupation,
                },
            }),
            // Profile table
            prisma.profile.update({
                where: { userId },
                data: {
                    address: data.address,
                    phoneNo: data.phoneNo,
                },
            }),
            // User table
            prisma.user.update({
                where: { userId },
                data: {
                    email: data.email,
                },
            }),
        ]);

        return updatedPatient;
    } catch (error) {
        const message = getErrorMessage(error);
        Sentry.captureException(error, { extra: { message } });
        throw error;
    }
}

/**
 * Update next-of-kin patient information.
 */
export async function updateKinInfo(
    patientId: number,
    data: {
        nextOfKinName?: string;
        nextOfKinRelationship?: string;
        nextOfKinHomeAddress?: string;
        nextOfKinPhoneNo?: string;
        nextOfKinEmail?: string;
    }
): Promise<Patient> {
    try {
        // Ensure the user is signed in
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
            throw new Error("Not authenticated");
        }

        // Update patient next-of-kin fields
        const updatedPatient = await prisma.patient.update({
            where: { patientId },
            data: {
                nextOfKinName: data.nextOfKinName,
                nextOfKinRelationship: data.nextOfKinRelationship,
                nextOfKinHomeAddress: data.nextOfKinHomeAddress,
                nextOfKinPhoneNo: data.nextOfKinPhoneNo,
                nextOfKinEmail: data.nextOfKinEmail,
            },
        });

        return updatedPatient;
    } catch (error) {
        const message = getErrorMessage(error);
        Sentry.captureException(error, { extra: { message } });
        throw error;
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
        // Split the input name into firstName and lastName
        const [firstName, ...lastNameParts] = name.trim().split(" ");
        const lastName = lastNameParts.join(" ") || undefined;

        let whereClause: Record<string, any> = {
            user: {
                profile: {
                    firstName: firstName,
                    ...(lastName && { lastName }),
                },
            },
        };

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
            select: {
                patientId: true,
                user: {
                    select: {
                        profile: {
                            select: {
                                dateOfBirth: true,
                            },
                        },
                    },
                },
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

// Fetch patients details using the patient ID
export async function fetchPatientDetailsById(
    patientId: number
): Promise<Patient | null> {
    try {
        // Ensure user is signed in
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            redirect("/sign-in");
            throw new Error("Not authenticated");
        }

        const { role, hospitalId, id: userId } = session.user;

        // role where clause for appointments
        const appointmentWhere: any = { patientId };

        switch (role as Role) {
            case "SUPER_ADMIN":
                // no additional filters
                break;

            case "ADMIN":
            case "NURSE":
            case "STAFF":
                // only appointments at the same hospital
                if (hospitalId == null) {
                    throw new Error(`${role} missing hospitalId`);
                }
                appointmentWhere.hospitalId = hospitalId;
                break;

            case "DOCTOR":
                // only at their hospital AND assigned to them
                if (hospitalId == null) {
                    throw new Error("DOCTOR missing hospitalId");
                }
                appointmentWhere.hospitalId = hospitalId;
                // doctor relation filter by doctor.userId
                appointmentWhere.doctor = { userId };
                break;

            default:
                // PATIENT or any other: only their own appointments
                // (for patients to see only their own records)
                appointmentWhere.patient = { user: { id: userId } };
                break;
        }

        // Fetch patient with filtered appointments
        const patient = await prisma.patient.findUnique({
            where: { patientId },
            include: {
                medicalInformation: true,
                appointments: {
                    where: appointmentWhere,
                    orderBy: { appointmentDate: "desc" },
                    select: {
                        appointmentId: true,
                        appointmentDate: true,
                        type: true,
                        status: true,
                        doctor: {
                            include: {
                                user: {
                                    include: { profile: true },
                                },
                            },
                        },
                        notes: {
                            include: {
                                author: {
                                    include: {
                                        profile: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                            },
                                        },
                                    },
                                },
                            },
                            orderBy: { createdAt: "desc" },
                        },
                        services: {
                            include: {
                                service: {
                                    select: {
                                        serviceId: true,
                                        serviceName: true,
                                        type: true,
                                    },
                                },
                                department: {
                                    select: {
                                        departmentId: true,
                                        name: true,
                                    },
                                },
                                hospital: {
                                    select: {
                                        hospitalId: true,
                                        hospitalName: true,
                                    },
                                },
                            },
                        },
                        payments: {
                            include: {
                                service: {
                                    select: {
                                        serviceName: true,
                                        serviceId: true,
                                    },
                                },
                                hospital: {
                                    select: {
                                        hospitalName: true,
                                        hospitalId: true,
                                    },
                                },
                            },
                            orderBy: { createdAt: "desc" },
                        },
                        diagnosis: true,
                        prescription: true,
                        consultationFee: true,
                    },
                },
                hospital: true,
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });

        if (!patient) {
            console.warn(`Patient with ID '${patientId}' not found.`);
            return null;
        }

        return patient;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage, patientId } });
        console.error("Failed to fetch patient details by ID:", errorMessage);
        return null;
    }
}

// Update patients medical info using the patient ID
export async function updateMedicalInfo(
    patientId: number,
    data: Partial<MedicalInformation>
): Promise<MedicalInformation> {
    try {
        // BMI CALCULATION BY height and weight provided
        if (data.height && data.weight) {
            const heightInMeters = data.height;
            const weightInKg = data.weight;
            data.bmi = parseFloat(
                (weightInKg / (heightInMeters * heightInMeters)).toFixed(1)
            );
        }

        const updatedMedicalInfo = await prisma.medicalInformation.upsert({
            where: { patientId },
            update: data,
            create: { patientId, ...data },
        });

        return updatedMedicalInfo;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: { errorMessage, patientId, data },
        });
        console.error("Failed to update medical information:", errorMessage);
        throw new Error("Medical information update failed");
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
}): Promise<FetchedPatient[]> {
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
                // all patients for SUPER_ADMIN
                whereClause = {};
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                // patients only for the user's hospital
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
            select: {
                patientId: true,
                reasonForConsultation: true,
                user: {
                    select: {
                        email: true,
                        profile: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phoneNo: true,
                                dateOfBirth: true,
                                gender: true,
                            },
                        },
                    },
                },
                appointments: {
                    select: {
                        appointmentDate: true,
                    },
                    orderBy: {
                        appointmentDate: "desc",
                    },
                },
            },
        });

        return patients as FetchedPatient[];
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
