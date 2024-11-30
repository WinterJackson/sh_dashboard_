// src/app/(auth)/dashboard/appointments/page.tsx

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import AppointmentList from "@/components/appointments/AppointmentList";
import { Appointment, Session, Role, Hospital } from "@/lib/definitions";
import { fetchAllHospitals } from "@/lib/data";

const prisma = require("@/lib/prisma");

export default async function AppointmentsPage() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    const { role, hospitalId } = session.user;

    // Fetch appointments and total count based on role
    let appointments: Appointment[] = [];
    let totalAppointments = 0;
    let hospitals: Hospital[] = [];

    if (role === Role.SUPER_ADMIN) {
        [appointments, totalAppointments] = await prisma.$transaction([
            prisma.appointment.findMany({
                include: {
                    patient: true,
                    doctor: {
                        include: {
                            user: {
                                include: { profile: true },
                            },
                        },
                    },
                    hospital: true,
                },
                orderBy: {
                    appointmentDate: 'desc',
                },
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
                        include: {
                            user: {
                                include: { profile: true },
                            },
                        },
                    },
                    hospital: true,
                },
                orderBy: {
                    appointmentDate: 'desc',
                },
            }),
            prisma.appointment.count({ where: { hospitalId } }),
        ]);
    }

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