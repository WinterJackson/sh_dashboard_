// src/app/(auth)/dashboard/appointments/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AppointmentList from "@/components/appointments/AppointmentList";
import { fetchAllHospitals } from "@/lib/data";
import { Role, Appointment, Session, Hospital } from "@/lib/definitions";
import { redirect } from "next/navigation";

const prisma = require("@/lib/prisma");

export default async function AppointmentsPage() {
    const session: Session | null = await getServerSession(authOptions);

    // Redirect if no session
    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    const { role, hospitalId } = session.user;

    // Fetch appointments and hospitals based on role
    let appointments: Appointment[] = [];
    let totalAppointments: number = 0;
    let hospitals: Hospital[] = [];

    if (role === Role.SUPER_ADMIN) {
        [appointments, totalAppointments] = await prisma.$transaction([
            prisma.appointment.findMany({
                include: {
                    patient: true,
                    doctor: {
                        include: { user: { include: { profile: true } } },
                    },
                    hospital: true,
                },
                orderBy: { appointmentDate: "desc" },
            }),
            prisma.appointment.count(),
        ]);
        hospitals = await fetchAllHospitals();
    } else if (hospitalId) {
        [appointments, totalAppointments] = await prisma.$transaction([
            prisma.appointment.findMany({
                where: { hospitalId },
                include: {
                    patient: true,
                    doctor: {
                        include: { user: { include: { profile: true } } },
                    },
                    hospital: true,
                },
                orderBy: { appointmentDate: "desc" },
            }),
            prisma.appointment.count({ where: { hospitalId } }),
        ]);
    }

    // Render the appointments list
    return (
        <>
            <h1 className="text-xl font-bold bg-bluelight/5 rounded-[10px] p-2 mx-4 mt-3">
                Appointments
            </h1>
            <div className="p-4 pr-2 pt-4">
                <AppointmentList
                    appointments={appointments}
                    totalAppointments={totalAppointments}
                    session={session}
                    hospitals={hospitals}
                />
            </div>
        </>
    );
}
