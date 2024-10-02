// File: src/app/(auth)/dashboard/appointments/page.tsx

import React from "react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Appointment } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

const AppointmentsTable = dynamic<{
  appointments: Appointment[];
  totalAppointments: number;
  currentPage: number;
}>(
  () => import("@/components/appointments/AppointmentsTable"),
  {
    ssr: false,
  }
);

const ITEMS_PER_PAGE = 15;

interface SearchParams {
  page?: string;
}

interface AppointmentsPageProps {
  searchParams: SearchParams;
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
    return null;
  }

  const { user } = session;
  const { role, hospitalId } = user || {};
  const page = parseInt(searchParams.page || "1");

  let appointments = [];
  let totalAppointments = 0;

  // Role-based logic for fetching appointments
  if (role === "SUPER_ADMIN") {
    // Super Admin: fetch all appointments
    [appointments, totalAppointments] = await prisma.$transaction([
      prisma.appointment.findMany({
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        include: {
          patient: true,
          doctor: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      }),
      prisma.appointment.count(),
    ]);
  } else if (hospitalId) {
    // Admin, Doctor, Nurse, Staff: fetch appointments by hospitalId
    [appointments, totalAppointments] = await prisma.$transaction([
      prisma.appointment.findMany({
        where: { hospitalId: hospitalId },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
        include: {
          patient: true,
          doctor: {
            include: {
              user: {
                include: {
                  profile: true,
                },
              },
            },
          },
        },
      }),
      prisma.appointment.count({
        where: { hospitalId: hospitalId },
      }),
    ]);
  }

  return (
    <div>
      <div className="text-xl font-semibold p-4 pr-2">
        <h1 className="text-xl min-w-full font-semibold">Appointments</h1>
      </div>
      <div className="p-4 pr-2 pt-7">
        <div className="flex w-full flex-row justify-between items-center">
          <AppointmentsTable
            appointments={appointments}
            totalAppointments={totalAppointments}
            currentPage={page}
          />
        </div>
      </div>
    </div>
  );
}
