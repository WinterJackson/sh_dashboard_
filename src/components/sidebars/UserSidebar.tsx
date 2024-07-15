// src/components/sidebars/UserSidebar.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
    CalendarIcon,
    DashboardIcon,
    PersonIcon,
    ChevronRightIcon,
    ChatBubbleIcon,
    GearIcon,
    ExitIcon,
} from "@radix-ui/react-icons";
import { getFirstName } from "@/lib/utils";
import Skeleton from "@mui/material/Skeleton";
import LoadingSpinner from "../ui/loading";
import { useSession } from "next-auth/react";

const UserSidebar = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        await signOut({ callbackUrl: "/sign-in" });
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
            <div className="flex-grow pb-60 pt-20">
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

                    <Link
                        href="/dashboard/messages"
                        className={`py-2 px-4 pt-4 pb-4 font-semibold flex items-center ${
                            isActive("/dashboard/messages")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <ChatBubbleIcon className="mr-2 text-xl" />
                        Messages
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

export default UserSidebar;

