// File: src/app/dashboard/appointments/page.tsx

import React from "react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Appointment } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

const AppointmentsTable = dynamic<{ appointments: Appointment[], totalAppointments: number, currentPage: number }>(
    () => import("@/components/appointments/AppointmentsTable"),
    {
        ssr: false,
    }
);

const ITEMS_PER_PAGE = 5;

interface SearchParams {
    page?: string;
}

interface AppointmentsPageProps {
    searchParams: SearchParams;
}

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
        return null;
    }

    const page = parseInt(searchParams.page || "1");

    const [appointments, totalAppointments] = await prisma.$transaction([
        prisma.appointment.findMany({
            skip: (page - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
            include: {
                patient: true,
                doctor: true,
            },
        }),
        prisma.appointment.count(),
    ]);

    return (
        <>
            <div className="text-xl font-semibold p-4">
                <h1 className="text-xl min-w-full font-semibold">
                    Appointments
                </h1>
            </div>
            <div className="p-4 pt-7">
                <div className="flex flex-row justify-between items-center mb-5">
                    <AppointmentsTable
                        appointments={appointments}
                        totalAppointments={totalAppointments}
                        currentPage={page}
                    />
                </div>
            </div>
        </>
    );
}
