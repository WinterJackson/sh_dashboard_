// File: src/components/sidebar/SidebarWrapper.tsx

import React from "react";
import Sidebar from "./ui/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


const SidebarWrapper: React.FC = async () => {
    // Fetch the session
    const session = await getServerSession(authOptions);

    // Extract only required fields
    const username = session?.user?.username || "Guest User";
    const role = session?.user?.role || "Guest";

    return <Sidebar username={username} role={role} />;
};

export default SidebarWrapper;
