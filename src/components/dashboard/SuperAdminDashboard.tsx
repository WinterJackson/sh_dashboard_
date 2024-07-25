// src/components/dashboard/SuperAdminDashboard.tsx

"use client"

import React from "react";
import { useSession } from "next-auth/react";
import AvailableBedsCard from "./AvailableBedsCard";
import AvailableDoctorsCard from "./AvailableDoctorsCard";
import PatientsTodayCard from "./PatientsTodayCard";
import AppointmentsTodayCard from "./AppointmentsTodayCard";

const SuperAdminDashboard: React.FC = () => {
    const { data: session } = useSession();
    const firstName = session?.user ? session.user.username.split(" ")[0] : "Super Admin";

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
                        <AvailableDoctorsCard />
                        <AvailableBedsCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default SuperAdminDashboard;
