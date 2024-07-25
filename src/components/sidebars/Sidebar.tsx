// File: src/components/sidebars/Sidebar.tsx

"use client";

import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import SuperAdminSidebar from "./SuperAdminSidebar";
import AdminSidebar from "./AdminSidebar";
import DoctorSidebar from "./DoctorSidebar";
import NurseSidebar from "./NurseSidebar";
import StaffSidebar from "./StaffSidebar";

const Sidebar = () => {
    const userRole = useUserRole();

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
        default:
            return null;
    }
};

export default Sidebar;
