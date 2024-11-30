// src/components/sidebars/Sidebar.tsx

import { getFirstName } from "@/lib/utils";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Skeleton from "@mui/material/Skeleton";
import {
    CalendarIcon,
    ChevronRightIcon,
    DashboardIcon,
    ExitIcon,
    GearIcon,
    PersonIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import DoctorsDropdown from "./ui/DoctorsDropdown";
// import LoadingWrapper from "../ui/LoadingWrapper";
import LogoutButton from "./../sidebar/ui/LogoutButton";
import React from "react";
import { Session } from "@/lib/definitions";

type SidebarProps = {
    pathname: string;
    session: Session | null;
    profileData: any;
};


export default function Sidebar({ pathname, session, profileData }: SidebarProps) {
    const user = session?.user;
    const firstName = user ? getFirstName(user.username) : "";
    const nameWidth = firstName ? firstName.length * 10 : 100;
    const userRole = user?.role;

    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <div className="relative w-64 h-full bg-white shadow-lg shadow-gray-300 flex flex-col rounded-2xl">
            <div className="flex-grow pt-20">
                <nav className="flex flex-col pb-60">
                    <Link
                        href="/dashboard"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
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
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
                            isActive("/dashboard/appointments")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <CalendarIcon className="mr-2 text-xl" />
                        Appointments
                        <ChevronRightIcon className="ml-auto text-xl" />
                    </Link>

                    {userRole !== "DOCTOR" && (
                        <DoctorsDropdown
                            isActive={isActive}
                            currentPath="/dashboard/doctors"
                        />
                    )}
                    <Link
                        href="/dashboard/patients"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
                            isActive("/dashboard/patients")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <PersonIcon className="mr-2 text-xl" />
                        Patients
                        <ChevronRightIcon className="ml-auto text-xl" />
                    </Link>
                    {userRole === "SUPER_ADMIN" && (
                        <Link
                            href="/dashboard/hospitals"
                            className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
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
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
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
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
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
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
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
                    <div className="flex-grow items-start bg-slate-100 py-1 px-2 hover:bg-bluelight/10 rounded-[10px]">
                        <p className="font-semibold text-nowrap">{firstName}</p>
                        {user ? (
                            <p className="text-xs text-nowrap text-gray-400">
                                {user.role}
                            </p>
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
}
