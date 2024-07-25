// src/components/dashboard/AdminDashboard.tsx

"use client"

import React from "react";
import { useSession } from "next-auth/react";

const AdminDashboard: React.FC = () => {
    const { data: session } = useSession();
    const firstName = session?.user ? session.user.username.split(" ")[0] : "Admin";

    return (
        <div className="h-full p-4">
            <div className="text-xl font-semibold">
                Welcome, {firstName}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Add cards or components displaying data relevant to Admin */}
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-lg font-medium">Hospital Overview Admin Dashboard</h2>
                    {/* Content displaying hospital data */}
                </div>
                <div className="bg-white shadow rounded p-4">
                    <h2 className="text-lg font-medium">Staff Management</h2>
                    {/* Content displaying staff management data */}
                </div>
                {/* Add more sections as needed */}
            </div>
        </div>
    );
};

export default AdminDashboard;
