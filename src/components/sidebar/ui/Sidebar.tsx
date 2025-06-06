// src/components/sidebar/ui/Sidebar.tsx

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    CalendarIcon,
    ChevronRightIcon,
    DashboardIcon,
    GearIcon,
} from "@radix-ui/react-icons";
import { MessageSquare } from 'lucide-react';
import DoctorsDropdown from "./DoctorsDropdown";
import HospitalsDropdown from "./HospitalsDropdown";
import LogoutButton from "./LogoutButton";
import Skeleton from "@mui/material/Skeleton";
import { Role } from "@/lib/definitions";
import PatientsDropdown from "./PatientsDropdown";

type SidebarProps = {
    username: string;
  role?: Role;
};

const Sidebar: React.FC<SidebarProps> = ({ username, role }) => {
    const pathname = usePathname();

    // Extract first name from username
    const firstName = username.split(" ")[0] || "";
    const nameWidth = firstName ? firstName.length * 10 : 100;

    const isActive = (href: string) => pathname === href;

    return (
        <div className="relative w-64 h-auto bg-white shadow-lg shadow-gray-300 flex flex-col rounded-2xl">
            <div className="flex-grow pt-20">
                <nav className="flex flex-col pb-60">
                    <Link
                        href="/dashboard"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-b-2 ${
                            isActive("/dashboard")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <DashboardIcon className="mr-2 text-xl" />
                        Dashboard
                    </Link>

                    {(role === Role.ADMIN || role === Role.SUPER_ADMIN) && (
                        <HospitalsDropdown isActive={isActive} role={role} />
                    )}

                    <Link
                        href="/dashboard/appointments"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-2 ${
                            isActive("/dashboard/appointments")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <CalendarIcon className="mr-2 text-xl" />
                        Appointments
                        <ChevronRightIcon className="ml-auto text-xl" />
                    </Link>

                    {role !== Role.DOCTOR && (
                        <DoctorsDropdown
                            isActive={isActive}
                            currentPath="/dashboard/doctors"
                        />
                    )}

                    <PatientsDropdown isActive={isActive} role={role} />

                    <Link
                        href="/dashboard/messaging"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-2 ${
                            isActive("/dashboard/messaging")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <MessageSquare className="mr-2 text-lg" />
                        Messaging
                    </Link>

                    <Link
                        href="/dashboard/settings"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-2 ${
                            isActive("/dashboard/settings")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <GearIcon className="mr-2 text-xl" />
                        Settings
                    </Link>
                </nav>
            </div>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex-grow items-start bg-slate-100 py-1 px-2 hover:bg-bluelight/10 rounded-[10px] shadow-sm shadow-gray-400">
            {username !== "Guest User" && role != null ? (
                            <>
                                <p className="font-semibold text-nowrap uppercase">
                                    {firstName}
                                </p>
                                <p className="text-xs text-nowrap text-gray-400">
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
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
