// File: src/components/sidebars/Sidebar.tsx

"use client";

import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import SuperAdminSidebar from "@/components/sidebars/SuperAdminSidebar";
import AdminSidebar from "@/components/sidebars/AdminSidebar";
import DoctorSidebar from "@/components/sidebars/DoctorSidebar";
import NurseSidebar from "@/components/sidebars/NurseSidebar";
import StaffSidebar from "@/components/sidebars/StaffSidebar";

const Sidebar = () => {
    const userRole = useUserRole();

    return (
        <div className="h-full p-2 pt-3 pb-8 bg-gray-100">
            {/* Switch based on user role */}
            {(() => {
                switch (userRole) {
                    case "SUPER_ADMIN":
                        return <SuperAdminSidebar />;
                    case "ADMIN":
                        return <AdminSidebar />;
                    case "DOCTOR":
                        return <DoctorSidebar />;
                    case "NURSE":
                        return <NurseSidebar />;
                    case "STAFF":
                        return <StaffSidebar />;

                }
            })()}
        </div>
    );
};

export default Sidebar;
