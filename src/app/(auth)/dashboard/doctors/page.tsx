// src/app/(auth)/dashboard/doctors/page.tsx

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import DoctorsList from "@/components/doctors/DoctorsList";
import { Doctor, Session, Hospital, Department, Role } from "@/lib/definitions";
import React from "react";

const prisma = require("@/lib/prisma");

async function fetchDoctors(sessionUser: Session["user"]): Promise<Doctor[]> {
    if (sessionUser.role === "SUPER_ADMIN") {
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
    } else if (sessionUser.hospitalId) {
        return await prisma.doctor.findMany({
            where: { hospitalId: sessionUser.hospitalId },
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

async function fetchDepartments(sessionUser: Session["user"]): Promise<Department[]> {
    if (sessionUser.role === "SUPER_ADMIN") {
        // Super Admin: Fetch all departments
        return await prisma.department.findMany();
    } else if (sessionUser.hospitalId) {
        // Other roles: Fetch departments linked with the user hospital
        return await prisma.department.findMany({
            where: {
                hospitals: {
                    some: {
                        hospitalId: sessionUser.hospitalId,
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
    const authSession = await getSession();

    if (!authSession) {
        redirect("/sign-in");
        return null;
    }

    const session: Session | null = authSession
    ? {
        userId: authSession.user?.id ?? "",
        expires: new Date(authSession.expires),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
            id: authSession.user?.id ?? "",
            username: authSession.user?.name ?? "",
            role: authSession.user?.role as Role ?? "DOCTOR",
            hospitalId: authSession.user?.hospitalId ?? null,
            hospital: authSession.user?.hospital ?? null,
        },
    }
    : null;

    const doctors = session ? await fetchDoctors(session.user) : [];
    const hospitals = await fetchHospitals();
    const departments = session ? await fetchDepartments(session.user) : [];

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
