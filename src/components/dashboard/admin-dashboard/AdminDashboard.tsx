// src/components/dashboard/AdminDashboard.tsx

"use client";

import { useSession } from "next-auth/react";
import React from "react";
import AppointmentsTodayCard from "../AppointmentsTodayCard";
import AvailableBedsCard from "../AvailableBedsCard";
import AvailableDoctorsCard from "../AvailableDoctorsCard";
import PatientsTodayCard from "../PatientsTodayCard";
import OutwardReferralsCard from "../OutwardReferralsCard";
import InwardReferralsCard from "../InwardReferralsCard";
import PatientsGraphCard from "../PatientsGraphCard";
import DashboardAppointments from "@/components/appointments/DashboardAppointments";
import TopDoctorsCard from "../TopDoctorsCard";
import LearnMoreCard from "../LearnMoreCard";

const AdminDashboard: React.FC = () => {
    const { data: session } = useSession();
    const firstName = session?.user
        ? session.user.username.split(" ")[0]
        : "Admin";

    return (
        <>
            <div className="text-xl font-semibold p-4">
                Welcome, {firstName}
            </div>
            <div className="flex">
                <div className="grid w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        <AvailableDoctorsCard />
                        <AvailableBedsCard />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        <AppointmentsTodayCard />
                        <PatientsTodayCard />
                    </div>
                </div>
                <div className="grid w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        <OutwardReferralsCard />
                        <InwardReferralsCard />
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="grid w-full p-4">
                    <PatientsGraphCard />
                </div>
                <div className="grid w-full p-4">
                    <PatientsGraphCard />
                </div>
            </div>
            <div className="flex w-full">
                <div className="w-2/3 p-4">
                    <DashboardAppointments />
                </div>
                <div className="w-1/3 p-2 h-full">
                    <div className="h-1/2">
                        <TopDoctorsCard />
                    </div>
                    <div className="h-1/2">
                        <LearnMoreCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
