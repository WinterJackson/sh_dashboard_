// File: src/components/Sidebar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { DashboardIcon, CalendarIcon, PersonIcon, ChevronRightIcon, ExitIcon } from "@radix-ui/react-icons";
import { getFirstName } from "@/lib/utils";
import LoadingSpinner from "./ui/loading";
import Skeleton from '@mui/material/Skeleton';

const Sidebar = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        await signOut({ callbackUrl: '/sign-in' });
        setIsLoading(false);
        router.replace("/sign-in"); // Redirect to sign-in page after logout
    };

    const isActive = (href: string) => {
        return pathname === href;
    };

    const firstName = session?.user ? getFirstName(session.user.username) : "";
    const nameWidth = firstName ? firstName.length * 10 : 100;

    return (
        <div className="relative w-64 h-full bg-white shadow-lg shadow-gray-300 flex flex-col rounded-2xl m-2">
            {isLoading && <LoadingSpinner />}
            <div className="flex-grow pb-80 pt-20">
                <nav className="flex flex-col pb-80">
                    <Link
                        href="/dashboard"
                        className={`py-2 px-4 font-semibold flex items-center ${
                            isActive("/dashboard")
                                ? "bg-primary text-white"
                                : "hover:bg-primary hover:text-white"
                        }`}
                    >
                        <DashboardIcon className="mr-2 text-xl" />
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/appointments"
                        className={`py-2 px-4 font-semibold flex items-center ${
                            isActive("/dashboard/appointments")
                                ? "bg-primary text-white"
                                : "hover:bg-primary hover:text-white"
                        }`}
                    >
                        <CalendarIcon className="mr-2 text-xl" />
                        Appointments
                        <ChevronRightIcon className="ml-auto text-xl" />
                    </Link>
                    <Link
                        href="/dashboard/doctors"
                        className={`py-2 px-4 font-semibold flex items-center ${
                            isActive("/dashboard/doctors")
                                ? "bg-primary text-white"
                                : "hover:bg-primary hover:text-white"
                        }`}
                    >
                        <PersonIcon className="mr-2 text-xl" />
                        Doctors
                        <ChevronRightIcon className="ml-auto text-xl" />
                    </Link>
                    <Link
                        href="/dashboard/patients"
                        className={`py-2 px-4 font-semibold flex items-center ${
                            isActive("/dashboard/patients")
                                ? "bg-primary text-white"
                                : "hover:bg-primary hover:text-white"
                        }`}
                    >
                        <PersonIcon className="mr-2 text-xl" />
                        Patients
                        <ChevronRightIcon className="ml-auto text-xl" />
                    </Link>
                </nav>
            </div>
            <div className="p-4">
                <div className="flex items-center">
                    <div className="flex-grow">
                            <p className="font-semibold text-nowrap">{firstName}</p>
                            {session?.user ? (
                                <p className="text-sm text-nowrap text-gray-400">
                                    {session.user.role}
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

                    {/* <div className="flex-grow">
                        {session?.user ? (
                            <>
                                <p className="font-semibold">{firstName}</p>
                                <p className="text-sm text-gray-400">
                                    {session.user.role}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="font-semibold">Username</p>
                                <p className="text-sm text-gray-400">Role</p>
                            </>
                        )}
                    </div> */}
                    <div className="flex items-center gap-2">
                        <ExitIcon className="mr-auto text-xl text-primary" />
                        <button
                            className="py-2 px-4 text-primary hover:bg-primary hover:text-white rounded-md"
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
