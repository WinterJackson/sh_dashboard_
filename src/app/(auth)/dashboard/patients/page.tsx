// src/app/(auth)/dashboard/patients/page.tsx

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import PatientsList from "@/components/patients/PatientsList";
import { Patient, Role, Session } from "@/lib/definitions";
import React from "react";

const prisma = require("@/lib/prisma");

// Fetch patients based on user role and hospital association
async function fetchPatients(sessionUser: Session["user"]): Promise<Patient[]> {
    if (sessionUser.role === Role.SUPER_ADMIN) {
        // Fetch all patients for SUPER_ADMIN
        return await prisma.patient.findMany({
            include: {
                hospital: true,
                appointments: true,
            },
        });
    } else if (sessionUser.hospitalId) {
        // Fetch patients for specific hospital for other roles
        return await prisma.patient.findMany({
            where: { hospitalId: sessionUser.hospitalId },
            include: {
                hospital: true,
                appointments: true,
            },
        });
    }
    return [];
}

export default async function PatientsPage() {
    const authSession = await getSession();

    // Redirect to sign-in page if no valid session found
    if (!authSession) {
        redirect("/sign-in");
        return null;
    }

    // Define session structure and extract user details
    const session: Session | null = authSession
        ? {
              userId: authSession.user?.id ?? "",
              expires: new Date(authSession.expires),
              createdAt: new Date(),
              updatedAt: new Date(),
              user: {
                  id: authSession.user?.id ?? "",
                  username: authSession.user?.name ?? "",
                  role: authSession.user?.role as Role,
                  hospitalId: authSession.user?.hospitalId ?? null,
                  hospital: authSession.user?.hospital ?? null,
              },
          }
        : null;

    // Fetch patients based on session user role and hospital association
    const allPatients = session?.user ? await fetchPatients(session.user) : [];
    const totalPatients = allPatients.length;

    // Fetch all hospitals for filtering and display
    const hospitals = await prisma.hospital.findMany();

    return (
        <div className="flex flex-col gap-3 p-3">
            <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">
                Patients
            </h1>
            <PatientsList
                patients={allPatients}
                totalPatients={totalPatients}
                hospitals={hospitals}
                session={session}
            />
        </div>
    );
}
