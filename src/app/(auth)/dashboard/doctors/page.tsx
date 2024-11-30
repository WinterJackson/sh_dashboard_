// src/app/(auth)/dashboard/doctors/page.tsx

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import DoctorsList from "@/components/doctors/DoctorsList";
import { Doctor, Department, Hospital, Role } from "@/lib/definitions";
import React from "react";

const prisma = require("@/lib/prisma");

async function fetchDoctors(user: { role: Role; hospitalId: string | null }): Promise<Doctor[]> {
    if (user.role === "SUPER_ADMIN") {
        return await prisma.doctor.findMany({
            include: {
                hospital: true,
                specialization: true,
                department: true,
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    } else if (user.hospitalId) {
        return await prisma.doctor.findMany({
            where: { hospitalId: user.hospitalId },
            include: {
                hospital: true,
                specialization: true,
                department: true,
                user: {
                    include: {
                        profile: true,
                    },
                },
            },
        });
    }
    return [];
}

async function fetchDepartments(user: { role: Role; hospitalId: string | null }): Promise<Department[]> {
    if (user.role === "SUPER_ADMIN") {
        return await prisma.department.findMany();
    } else if (user.hospitalId) {
        return await prisma.department.findMany({
            where: {
                hospitals: {
                    some: {
                        hospitalId: user.hospitalId,
                    },
                },
            },
        });
    }
    return [];
}

async function fetchHospitals(): Promise<Hospital[]> {
    return await prisma.hospital.findMany();
}

export default async function DoctorsPage() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    const { user } = session;

    const doctors = await fetchDoctors(user);
    const hospitals = await fetchHospitals();
    const departments = await fetchDepartments(user);

    return (
        <div className="flex flex-col gap-3 p-3">
            <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">
                Doctors
            </h1>
            <DoctorsList
                doctors={doctors}
                hospitals={hospitals}
                departments={departments}
                session={session}
            />
        </div>
    );
}
