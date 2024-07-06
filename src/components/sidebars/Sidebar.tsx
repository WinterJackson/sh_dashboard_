// File: src/components/sidebars/Sidebar.tsx

"use client";

import React from "react";
import { useUserRole } from "@/hooks/useUserRole";
import AdminSidebar from "./AdminSidebar";
import UserSidebar from "./UserSidebar";

const Sidebar = () => {
    const userRole = useUserRole();

    if (userRole === "Admin") {
        return <AdminSidebar />;
    } else {
        return <UserSidebar />;
    }
};

export default Sidebar;
