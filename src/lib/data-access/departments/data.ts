// src/lib/data-access/departments/data.ts

"use server";

import { Department, DepartmentType, Role } from "@/lib/definitions";
import * as Sentry from "@sentry/nextjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getErrorMessage } from "@/hooks/getErrorMessage";

import prisma from "@/lib/prisma";

/**
 * Fetches a list of departments based on the user's role and hospital association.
 */
export async function fetchDepartments(user?: {
    role: Role;
    hospitalId: string | null;
}): Promise<Department[]> {
    if (!user) {
        const session = await getServerSession(authOptions);

        if (!session || !session?.user) {
            console.error("Session fetch failed:", session);
            redirect("/sign-in");
            return [];
        }

        user = {
            role: session.user.role as Role,
            hospitalId: session.user.hospitalId
                ? session.user.hospitalId.toString()
                : null,
        };
    }

    try {
        let whereClause: any = {};

        // Define the filter clause based on the user role
        switch (user.role) {
            case "SUPER_ADMIN":
                // No filtering for SUPER_ADMIN, see all departments
                break;

            case "ADMIN":
            case "DOCTOR":
            case "NURSE":
            case "STAFF":
                if (!user.hospitalId) {
                    throw new Error(
                        `${user.role}s must have an associated hospital ID.`
                    );
                }
                // Filter departments by hospitalId for other roles
                whereClause.hospitals = {
                    some: {
                        hospitalId: parseInt(user.hospitalId, 10),
                    },
                };
                break;

            default:
                throw new Error("Invalid role provided.");
        }

        // Fetch departments based on the filter criteria
        const departments = await prisma.department.findMany({
            where: whereClause,
            select: {
                departmentId: true,
                name: true,
                hospitals: {
                    select: {
                        hospitalId: true,
                        hospital: {
                            select: {
                                hospitalName: true,
                            },
                        },
                    },
                },
            },
        });

        return departments;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, { extra: { errorMessage } });
        console.error("Failed to fetch departments by user:", errorMessage);
        return [];
    }
}

/**
 * Add department.
 */
export interface CreateDepartmentInput {
    name: string;
    type: DepartmentType;
    description?: string;

    // HospitalDepartment-specific fields:
    headOfDepartment?: string;
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
    establishedYear?: number;
}

export const addDepartment = async (
    hospitalId: number,
    departmentData: CreateDepartmentInput
) => {
    try {
        // 1) Create the Department row
        const newDepartment = await prisma.department.create({
            data: {
                name: departmentData.name,
                type: departmentData.type,
                description: departmentData.description,
            },
        });

        // 2) Link it in HospitalDepartment
        await prisma.hospitalDepartment.create({
            data: {
                hospitalId: hospitalId,
                departmentId: newDepartment.departmentId,
                headOfDepartment: departmentData.headOfDepartment,
                contactEmail: departmentData.contactEmail,
                contactPhone: departmentData.contactPhone,
                location: departmentData.location,
                establishedYear: departmentData.establishedYear,
                description: departmentData.description,
            },
        });

        return newDepartment;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: { errorMessage, hospitalId, departmentData },
        });
        throw new Error("Failed to create department");
    }
};

/**
 * Delete department.
 */
export const deleteDepartment = async (
    hospitalId: number,
    departmentId: number
) => {
    try {
        // Remove hospital association first
        await prisma.hospitalDepartment.delete({
            where: {
                hospitalId_departmentId: {
                    hospitalId,
                    departmentId,
                },
            },
        });

        // delete department
        await prisma.department.delete({
            where: { departmentId },
        });

        return { success: true };
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        Sentry.captureException(error, {
            extra: { errorMessage, hospitalId, departmentId },
        });
        throw new Error("Failed to delete department");
    }
};
