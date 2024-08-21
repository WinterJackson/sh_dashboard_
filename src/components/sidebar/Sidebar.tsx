// src/components/sidebars/Sidebar.tsx

"use client";

import { useSessionData } from "@/hooks/useSessionData";
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
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LoadingSpinner from "../ui/loading";

const Sidebar = () => {
    const router = useRouter();
    const sessionData = useSessionData();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    // console.log(sessionData)

    const handleLogout = async () => {
        setIsLoading(true);
        await signOut({ callbackUrl: "/sign-in" });
        setIsLoading(false);
        router.replace("/sign-in"); // Redirect to sign-in page after logout
    };

    const isActive = (href: string) => {
        return pathname === href;
    };

    const firstName = sessionData?.user
        ? getFirstName(sessionData.user.username)
        : "";
    const nameWidth = firstName ? firstName.length * 10 : 100;

    const userRole = sessionData?.user?.role;

    return (
        <div className="relative w-64 h-full bg-white shadow-lg shadow-gray-300 flex flex-col rounded-2xl">
            {isLoading && <LoadingSpinner />}
            <div className="flex-grow pt-20">
                <nav className="flex flex-col pb-60">

                    {/* Dashboard link visible to all users */}
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

                    {/* Appointments link visible to all users */}
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

                    {/* Doctors link visible to all users except doctors */}
                    {userRole !== "DOCTOR" && (
                        <Link
                            href="/dashboard/doctors"
                            className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
                                isActive("/dashboard/doctors")
                                    ? "bg-primary text-white"
                                    : "hover:bg-bluelight hover:text-black"
                            }`}
                        >
                            <PersonIcon className="mr-2 text-xl" />
                            Doctors
                            <ChevronRightIcon className="ml-auto text-xl" />
                        </Link>
                    )}

                    {/* Patients link visible to all users */}
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

                    {/* Hospitals link visible only to SUPER_ADMIN */}
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

                    {/* Messaging link visible to all users */}
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

                    {/* Settings link visible to all users */}
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

                    {/* Profile link visible to all users */}
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
                <div className="flex items-center">
                    <div className="flex-grow">
                        <p className="font-semibold text-nowrap">{firstName}</p>
                        {sessionData?.user ? (
                            <p className="text-xs text-nowrap text-gray-400">
                                {sessionData.user.role}
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
                    <div className="flex items-center gap-2">
                        <ExitIcon className="mr-auto text-xl text-primary" />
                        <button
                            className="py-2 px-4 text-primary hover:bg-primary hover:text-white rounded-[10px]"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
