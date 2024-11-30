// src/app/(auth)/dashboard/patients/page.tsx

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PatientsList from "@/components/patients/PatientsList";
import { Patient, Role } from "@/lib/definitions";
import React from "react";

const prisma = require("@/lib/prisma");

// Fetch patients based on user role and hospital association
async function fetchPatients(user: { role: Role; hospitalId?: number | null }): Promise<Patient[]> {
    if (user.role === "SUPER_ADMIN") {
        // Fetch all patients for SUPER_ADMIN
        return prisma.patient.findMany({
            include: {
                hospital: true,
                appointments: true,
            },
        });
    }

    if (user.hospitalId) {
        // Fetch patients for specific hospital for other roles
        return prisma.patient.findMany({
            where: { hospitalId: user.hospitalId },
            include: {
                hospital: true,
                appointments: true,
            },
        });
    }

    return [];
}

export default async function PatientsPage() {
    // Get the session using the centralized `getSession` function
    const session = await getSession();

    // Redirect to sign-in page if no valid session found
    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    const { user } = session;

    // Fetch patients and hospitals
    const patients = await fetchPatients(user);
    const totalPatients = patients.length;
    const hospitals = await prisma.hospital.findMany();

    return (
        <div className="flex flex-col gap-3 p-3">
            <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">Patients</h1>
            <PatientsList
                patients={patients}
                totalPatients={totalPatients}
                hospitals={hospitals}
                session={session}
            />
        </div>
    );
}