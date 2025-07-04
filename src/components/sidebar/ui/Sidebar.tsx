// src/components/sidebar/ui/Sidebar.tsx

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Skeleton from "@mui/material/Skeleton";
import { Role } from "@/lib/definitions";
import LogoutButton from "./LogoutButton";
import ThemeToggle from "./ThemeToggle";
import SidebarLinks from "./SidebarLinks";

interface SidebarProps {
    username: string;
    role?: Role;
}

const Sidebar: React.FC<SidebarProps> = ({ username, role }) => {
    const pathname = usePathname();
    const firstName = username.split(" ")[0] || "";
    const nameWidth = firstName ? firstName.length * 10 : 100;

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex cursor-pointer relative w-64 h-auto bg-card shadow-md shadow-shadow-main flex-col rounded-2xl">
                <div className="flex-grow pt-20">
                    <nav className="flex flex-col pb-60">
                        <SidebarLinks role={role} />
                    </nav>
                </div>
                <div className="p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex-grow items-start bg-slate py-1 px-2 hover:bg-light-accent hover:text-accent-foreground rounded-[10px] shadow-sm shadow-shadow-main">
                            {username !== "Guest User" && role != null ? (
                                <>
                                    <p className="font-semibold text-nowrap uppercase text-main">
                                        {firstName}
                                    </p>
                                    <p className="text-xs text-nowrap text-text-subtle">
                                        {role}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Skeleton
                                        variant="text"
                                        width={nameWidth}
                                        height={20}
                                    />
                                    <Skeleton
                                        variant="text"
                                        width={nameWidth}
                                        height={15}
                                    />
                                </>
                            )}
                        </div>
                        <ThemeToggle />
                        <LogoutButton />
                    </div>
                </div>
            </div>

        </>
    );
};

export default Sidebar;
