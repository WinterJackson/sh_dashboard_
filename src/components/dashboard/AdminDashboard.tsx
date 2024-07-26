// src/components/dashboard/AdminDashboard.tsx

"use client"

import React from "react";
import { useSession } from "next-auth/react";
import AvailableDoctorsCard from "./AvailableDoctorsCard";
import AvailableBedsCard from "./AvailableBedsCard";
import AppointmentsTodayCard from "./AppointmentsTodayCard";
import PatientsTodayCard from "./PatientsTodayCard";

const AdminDashboard: React.FC = () => {
    const { data: session } = useSession();
    const firstName = session?.user ? session.user.username.split(" ")[0] : "Admin";

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

export default AdminDashboard;
