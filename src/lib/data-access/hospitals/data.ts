// src/lib/data-access/hospitals/data.ts

"use server";

import {
    BedCapacity,
    Department,
    DepartmentType,
    Hospital,
    HospitalDepartment,
    Role,
} from "@/lib/definitions";
import { loadHospitals } from "./loaders";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import * as Sentry from "@sentry/nextjs";

import prisma from "@/lib/prisma";
import { getErrorMessage } from "@/hooks/getErrorMessage";

/**
 * Fetches a list of hospitals.
 */
export async function fetchHospitals(user?: {
    role: Role;
    hospitalId: number | null;
    userId: string | null;
}): Promise<Hospital[]> {
    const session = await getServerSession(authOptions);

    if (!user) {
        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    // Enforce MFA for SUPER_ADMIN / ADMIN
    if (
        [Role.SUPER_ADMIN, Role.ADMIN].includes(user.role) &&
        !session?.user?.mfaVerified
    ) {
        redirect("/verify-token");
        return [];
    }

    return loadHospitals(user);
}

/**
 * Delete hospitals.
 */
export async function deleteHospitals(
    hospitalIds: number[]
): Promise<{ success: boolean; message?: string }> {
    try {
        if (hospitalIds.length === 0) {
            throw new Error("No hospital IDs provided");
        }

        // Verify existence first for better error handling
        const existingHospitals = await prisma.hospital.findMany({
            where: { hospitalId: { in: hospitalIds } },
            select: { hospitalId: true },
        });

        if (existingHospitals.length !== hospitalIds.length) {
            throw new Error("Some hospitals not found");
        }

        // Perform deletion in transaction
        await prisma.$transaction([
            prisma.hospital.deleteMany({
                where: { hospitalId: { in: hospitalIds } },
            }),
        ]);

        return { success: true };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: { errorMessage, hospitalIds },
        });
        console.error("Hospital deletion failed:", errorMessage);
        return { success: false, message: errorMessage };
    }
}

/**
 * Update hospital.
 */
export const updateHospital = async (
    hospitalId: number,
    data: Partial<Hospital>
) => {
    try {
        const updatedHospital = await prisma.hospital.update({
            where: { hospitalId },
            data: {
                // Basic identifiers
                hospitalName: data.hospitalName,
                hospitalLink: data.hospitalLink,
                phone: data.phone,
                email: data.email,
                referralCode: data.referralCode,

                // Classification / regulatory
                kephLevel: data.kephLevel,
                regulatoryBody: data.regulatoryBody,
                ownershipType: data.ownershipType,
                facilityType: data.facilityType,
                nhifAccreditation: data.nhifAccreditation,
                open24Hours: data.open24Hours,
                openWeekends: data.openWeekends,
                regulated: data.regulated,
                regulationStatus: data.regulationStatus,
                regulatingBody: data.regulatingBody,

                // Licensing / registration
                registrationNumber: data.registrationNumber,
                licenseNumber: data.licenseNumber,
                category: data.category,
                owner: data.owner,

                // Location fields
                county: data.county,
                subCounty: data.subCounty,
                ward: data.ward,
                town: data.town,
                streetAddress: data.streetAddress,
                nearestLandmark: data.nearestLandmark,
                plotNumber: data.plotNumber,
                latitude: data.latitude,
                longitude: data.longitude,

                // Contact / online presence
                emergencyPhone: data.emergencyPhone,
                emergencyEmail: data.emergencyEmail,
                website: data.website,
                logoUrl: data.logoUrl,
                operatingHours: data.operatingHours,

                // Descriptive
                description: data.description,
            },
        });
        return updatedHospital;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: { errorMessage, hospitalId, data },
        });
        throw new Error("Failed to update hospital");
    }
};

/**
 * Fetch hospital details.
 */
export async function fetchHospitalDetailsById(
    hospitalId: number,
    userOverride?: {
        role: Role;
        hospitalId: number | null;
        userId: string | null;
    }
): Promise<Hospital> {
    const session = await getServerSession(authOptions);

    let user = userOverride;
    if (!user) {
        if (!session || !session.user) {
            redirect("/sign-in");
            throw new Error("Redirecting to sign-in");
        }
        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    // Require MFA for SUPER_ADMIN and ADMIN
    if (
        [Role.SUPER_ADMIN, Role.ADMIN].includes(user.role) &&
        !session?.user?.mfaVerified
    ) {
        redirect("/verify-token");
        throw new Error("Redirecting to verify-token");
    }

    if (
        user.role !== Role.SUPER_ADMIN &&
        user.role !== Role.ADMIN &&
        user.role !== Role.DOCTOR &&
        user.role !== Role.NURSE &&
        user.role !== Role.STAFF
    ) {
        throw new Error("Unauthorized");
    }

    if (
        user.role !== Role.SUPER_ADMIN &&
        (user.hospitalId === null || user.hospitalId !== hospitalId)
    ) {
        throw new Error("Unauthorized to view this hospital");
    }

    try {
        const hospital = await prisma.hospital.findUnique({
            where: { hospitalId },
            include: {
                // hospital scalars are auto-selected
                // ─── HospitalDepartment join rows ───
                departments: {
                    select: {
                        hospitalId: true,
                        departmentId: true,
                        headOfDepartment: true,
                        contactEmail: true,
                        contactPhone: true,
                        location: true,
                        establishedYear: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                        // nested Department details
                        department: {
                            select: {
                                departmentId: true,
                                name: true,
                                description: true,
                                type: true,
                                // include specializations via join
                                specializationLinks: {
                                    select: {
                                        specialization: {
                                            select: {
                                                specializationId: true,
                                                name: true,
                                                description: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },

                // ─── Doctors ───
                doctors: {
                    select: {
                        doctorId: true,
                        specialization: {
                            select: {
                                specializationId: true,
                                name: true,
                                description: true,
                            },
                        },
                        department: {
                            select: {
                                departmentId: true,
                                name: true,
                                type: true,
                            },
                        },
                        user: {
                            select: {
                                userId: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        dateOfBirth: true,
                                        phoneNo: true,
                                    },
                                },
                            },
                        },
                        phoneNo: true,
                        status: true,
                        qualifications: true,
                        workingHours: true,
                        averageRating: true,
                        skills: true,
                        bio: true,
                        yearsOfExperience: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },

                // ─── Nurses ───
                nurses: {
                    select: {
                        nurseId: true,
                        specialization: {
                            select: {
                                specializationId: true,
                                name: true,
                                description: true,
                            },
                        },
                        department: {
                            select: {
                                departmentId: true,
                                name: true,
                                type: true,
                            },
                        },
                        user: {
                            select: {
                                userId: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        dateOfBirth: true,
                                        phoneNo: true,
                                    },
                                },
                            },
                        },
                        status: true,
                        qualifications: true,
                        workingHours: true,
                        averageRating: true,
                        skills: true,
                        bio: true,
                        yearsOfExperience: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },

                // ─── Staff ───
                staffs: {
                    select: {
                        staffId: true,
                        specialization: {
                            select: {
                                specializationId: true,
                                name: true,
                                description: true,
                            },
                        },
                        department: {
                            select: {
                                departmentId: true,
                                name: true,
                                type: true,
                            },
                        },
                        user: {
                            select: {
                                userId: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        dateOfBirth: true,
                                        phoneNo: true,
                                    },
                                },
                            },
                        },
                        status: true,
                        workingHours: true,
                        averageRating: true,
                        skills: true,
                        bio: true,
                        yearsOfExperience: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },

                // ─── Admins ───
                admins: {
                    select: {
                        adminId: true,
                        user: {
                            select: {
                                userId: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        dateOfBirth: true,
                                        phoneNo: true,
                                    },
                                },
                            },
                        },
                        createdAt: true,
                        updatedAt: true,
                    },
                },

                // ─── Patients ───
                patients: {
                    select: {
                        patientId: true,
                        user: {
                            select: {
                                userId: true,
                                profile: {
                                    select: {
                                        firstName: true,
                                        lastName: true,
                                        dateOfBirth: true,
                                        phoneNo: true,
                                    },
                                },
                            },
                        },
                        maritalStatus: true,
                        occupation: true,
                        nextOfKinName: true,
                        nextOfKinRelationship: true,
                        reasonForConsultation: true,
                        admissionDate: true,
                        dischargeDate: true,
                        status: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },

                // ─── Beds ───
                beds: {
                    select: {
                        bedId: true,
                        type: true,
                        ward: true,
                        availability: true,
                        patient: {
                            select: {
                                patientId: true,
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
                        createdAt: true,
                        updatedAt: true,
                    },
                },

                // ─── Payments ───
                payments: {
                    select: {
                        paymentId: true,
                        amount: true,
                        serviceId: true,
                        patient: {
                            select: { patientId: true },
                        },
                        appointment: {
                            select: { appointmentId: true },
                        },
                        createdAt: true,
                        updatedAt: true,
                    },
                },

                // ─── BedCapacity ───
                bedCapacity: {
                    select: {
                        bedCapacityId: true,
                        totalInpatientBeds: true,
                        generalInpatientBeds: true,
                        cots: true,
                        maternityBeds: true,
                        emergencyCasualtyBeds: true,
                        intensiveCareUnitBeds: true,
                        highDependencyUnitBeds: true,
                        isolationBeds: true,
                        generalSurgicalTheatres: true,
                        maternitySurgicalTheatres: true,
                    },
                },

                // ─── HospitalServices ───
                hospitalServices: {
                    select: {
                        hospitalId: true,
                        departmentId: true,
                        serviceId: true,
                        maxAppointmentsPerDay: true,
                        requiresReferral: true,
                        isWalkInAllowed: true,
                        basePrice: true,
                        discount: true,
                        equipmentRequired: true,
                        minStaffRequired: true,
                        duration: true,
                        createdAt: true,
                        updatedAt: true,
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
                                type: true,
                            },
                        },
                    },
                },

                // ─── AppointmentServices ───
                appointmentServices: {
                    select: {
                        appointmentId: true,
                        hospitalId: true,
                        patientId: true,
                        departmentId: true,
                        serviceId: true,
                        createdAt: true,
                        updatedAt: true,
                        service: {
                            select: {
                                serviceId: true,
                                serviceName: true,
                                type: true,
                            },
                        },
                        patient: {
                            select: { patientId: true },
                        },
                    },
                },

                // ─── Received Referrals ───
                receivedReferrals: {
                    select: {
                        referralId: true,
                        patientId: true,
                        originHospitalId: true,
                        destinationHospitalId: true,
                        referringDoctorId: true,
                        type: true,
                        status: true,
                        priority: true,
                        effectiveDate: true,
                        createdAt: true,
                        updatedAt: true,
                        referringDoctor: {
                            select: {
                                doctorId: true,
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
                    },
                },

                // ─── Sent Referrals ───
                sentReferrals: {
                    select: {
                        referralId: true,
                        patientId: true,
                        originHospitalId: true,
                        destinationHospitalId: true,
                        referringDoctorId: true,
                        type: true,
                        status: true,
                        priority: true,
                        effectiveDate: true,
                        createdAt: true,
                        updatedAt: true,
                        referringDoctor: {
                            select: {
                                doctorId: true,
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
                    },
                },
            },
        });

        if (!hospital) {
            throw new Error(`Hospital with ID ${hospitalId} not found`);
        }

        return hospital;
    } catch (error) {
        const errorMessage = getErrorMessage(error as Error);
        Sentry.captureException(error, { extra: { errorMessage, hospitalId } });
        throw new Error("Failed to load hospital details");
    }
}

/**
 * Given a hospitalId and (optionally) a userOverride, verify:
 *  1. There is a valid session.
 *  2. If role is SUPER_ADMIN or ADMIN, MFA must be verified.
 *  3. The role is one of SUPER_ADMIN, ADMIN, DOCTOR, NURSE, STAFF.
 *  4. If not SUPER_ADMIN, ensure user.hospitalId === hospitalId.
 *
 * Throws or redirects if unauthorized.
 * Returns the session’s user payload when valid.
 */
async function authorizeHospitalAccess(
    hospitalId: number,
    userOverride?: {
        role: Role;
        hospitalId: number | null;
        userId: string | null;
    }
) {
    const session = await getServerSession(authOptions);

    let user = userOverride;
    if (!user) {
        if (!session?.user) {
            redirect("/sign-in");
            throw new Error("Redirecting to sign-in");
        }
        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId ?? null,
            userId: session.user.id ?? null,
        };
    }

    // If SUPER_ADMIN or ADMIN, MFA must be verified
    if (
        [Role.SUPER_ADMIN, Role.ADMIN].includes(user.role) &&
        !session?.user?.mfaVerified
    ) {
        redirect("/verify-token");
        throw new Error("Redirecting to verify-token");
    }

    // Only these roles may fetch hospital data
    if (
        ![
            Role.SUPER_ADMIN,
            Role.ADMIN,
            Role.DOCTOR,
            Role.NURSE,
            Role.STAFF,
        ].includes(user.role)
    ) {
        throw new Error("Unauthorized");
    }

    // Non-SUPER_ADMINs may only see their own hospital
    if (
        user.role !== Role.SUPER_ADMIN &&
        (user.hospitalId === null || user.hospitalId !== hospitalId)
    ) {
        throw new Error("Unauthorized to view this hospital");
    }

    return user;
}

/**
 * Fetch complete Hospital record
 */
export async function fetchHospitalBasicInfo(
    hospitalId: number,
    userOverride?: {
        role: Role;
        hospitalId: number | null;
        userId: string | null;
    }
): Promise<Hospital> {
    await authorizeHospitalAccess(hospitalId, userOverride);

    const hospital = await prisma.hospital.findUniqueOrThrow({
        where: { hospitalId },
        select: {
            // Scalars
            hospitalId: true,
            hospitalName: true,
            hospitalLink: true,
            phone: true,
            email: true,
            kephLevel: true,
            regulatoryBody: true,
            ownershipType: true,
            facilityType: true,
            nhifAccreditation: true,
            open24Hours: true,
            openWeekends: true,
            regulated: true,
            regulationStatus: true,
            regulatingBody: true,
            registrationNumber: true,
            licenseNumber: true,
            category: true,
            owner: true,
            county: true,
            subCounty: true,
            ward: true,
            latitude: true,
            longitude: true,
            town: true,
            streetAddress: true,
            referralCode: true,
            description: true,
            emergencyPhone: true,
            emergencyEmail: true,
            website: true,
            logoUrl: true,
            operatingHours: true,
            nearestLandmark: true,
            plotNumber: true,
            createdAt: true,
            updatedAt: true,

            // ─── Array relations ───
            appointments: true,
            beds: true,
            doctors: true,
            nurses: true,
            departments: true,
            patients: true,
            payments: true,
            users: true,
            admins: true,
            staffs: true,
            conversations: true,
            bedCapacity: true,
            hospitalServices: true,
            appointmentServices: true,
            receivedReferrals: true,
            sentReferrals: true,
        },
    });

    return hospital as Hospital;
}

/**
 * Fetch all BedCapacity rows for a given hospital.
 */
export async function fetchBedCapacity(
    hospitalId: number,
    userOverride?: {
        role: Role;
        hospitalId: number | null;
        userId: string | null;
    }
): Promise<BedCapacity[]> {
    await authorizeHospitalAccess(hospitalId, userOverride);

    const rows = await prisma.bedCapacity.findMany({
        where: { hospitalId },
        select: {
            bedCapacityId: true,
            hospitalId: true,
            totalInpatientBeds: true,
            generalInpatientBeds: true,
            cots: true,
            maternityBeds: true,
            emergencyCasualtyBeds: true,
            intensiveCareUnitBeds: true,
            highDependencyUnitBeds: true,
            isolationBeds: true,
            generalSurgicalTheatres: true,
            maternitySurgicalTheatres: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return rows as BedCapacity[];
}

/**
 * Fetch HospitalDepartment rows, nested department and specializationLinks.
 */
export async function fetchHospitalDepartments(
    hospitalId: number,
    userOverride?: {
        role: Role;
        hospitalId: number | null;
        userId: string | null;
    }
): Promise<HospitalDepartment[]> {
    await authorizeHospitalAccess(hospitalId, userOverride);

    const rows = await prisma.hospitalDepartment.findMany({
        where: { hospitalId },
        select: {
            hospitalId: true,
            departmentId: true,
            headOfDepartment: true,
            contactEmail: true,
            contactPhone: true,
            location: true,
            establishedYear: true,
            description: true,
            createdAt: true,
            updatedAt: true,
            department: {
                select: {
                    departmentId: true,
                    name: true,
                    description: true,
                    type: true,
                    specializationLinks: {
                        select: {
                            specialization: {
                                select: {
                                    specializationId: true,
                                    name: true,
                                    description: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    return rows as HospitalDepartment[];
}
