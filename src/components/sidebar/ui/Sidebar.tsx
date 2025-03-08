// File: src/components/sidebar/ui/Sidebar.tsx

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    CalendarIcon,
    ChevronRightIcon,
    DashboardIcon,
    GearIcon,
    PersonIcon,
} from "@radix-ui/react-icons";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DoctorsDropdown from "./DoctorsDropdown";
import LogoutButton from "./LogoutButton";
import Skeleton from "@mui/material/Skeleton";

type SidebarProps = {
    username: string;
    role: string;
};

const Sidebar: React.FC<SidebarProps> = ({ username, role }) => {
    const pathname = usePathname();

    // Extract first name from username
    const firstName = username.split(" ")[0] || "";
    const nameWidth = firstName ? firstName.length * 10 : 100;
    const userRole = role;

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

                    {role !== "DOCTOR" && (
                        <DoctorsDropdown
                            isActive={isActive}
                            currentPath="/dashboard/doctors"
                        />
                    )}
                    <Link
                        href="/dashboard/patients"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-2 ${
                            isActive("/dashboard/patients")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <PersonIcon className="mr-2 text-xl" />
                        Patients
                        <ChevronRightIcon className="ml-auto text-xl" />
                    </Link>
                    {role === "SUPER_ADMIN" && (
                        <Link
                            href="/dashboard/hospitals"
                            className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-2 ${
                                isActive("/dashboard/hospitals")
                                    ? "bg-primary text-white"
                                    : "hover:bg-bluelight hover:text-black"
                            }`}
                        >
                            <LocalHospitalIcon className="mr-2 text-xl" />
                            Hospitals
                            <ChevronRightIcon className="ml-auto text-xl" />
                        </Link>
                    )}
                    <Link
                        href="/dashboard/messaging"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-2 ${
                            isActive("/dashboard/messaging")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <CalendarIcon className="mr-2 text-xl" />
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
                    <Link
                        href="/dashboard/profile"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center border-2 ${
                            isActive("/dashboard/profile")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <PersonIcon className="mr-2 text-xl" />
                        Profile
                    </Link>
                </nav>
            </div>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex-grow items-start bg-slate-100 py-1 px-2 hover:bg-bluelight/10 rounded-[10px] shadow-sm shadow-gray-400">
                        {username !== "Guest User" && role !== "Guest" ? (
                            <>
                                <p className="font-semibold text-nowrap">
                                    {firstName}
                                </p>
                                <p className="text-xs text-nowrap text-gray-400">
                                    {userRole}
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
