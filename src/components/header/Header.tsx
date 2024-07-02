// src/components/ui/dashboard/Header.tsx

"use client";

import React from "react";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import { FaUserCircle } from "react-icons/fa";
import { BellIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { getFirstName } from "@/lib/utils";
import Skeleton from "@mui/material/Skeleton";
import { useUser } from "@/app/context/UserContext";
// import Search from "@/components/ui/search";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const Search = dynamic(() => import("@/components/ui/search"));

// Dynamic import for AddAppointmentDialog
const AddAppointmentDialog = dynamic(() => import("@/components/appointments/AddAppointmentDialog"));

const Header = () => {
    const { data: session } = useSession();
    const { user } = useUser();
    const firstName = session?.user ? getFirstName(session.user.username) : "";
    const nameWidth = firstName ? firstName.length * 10 : 100;
    const profileImageUrl = user?.imageUrl;
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleAddAppointment = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("dialog", "addAppointment");
        router.replace(`?${params.toString()}`);
    };

    const handleDialogClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("dialog");
        router.replace(`?${params.toString()}`);
    };

    const dialogType = searchParams.get("dialog");

    return (
        <header className="flex w-auto items-center justify-between p-4 m-2 bg-white shadow-lg shadow-gray-300 rounded-2xl">
            {/* Logo */}
            <div className="flex items-center w-1/4">
                <Image
                    src={logo}
                    alt="Snark Health Logo"
                    width={120}
                    height={40}
                />
            </div>

            <div className="flex justify-between w-3/4">
                {/* Center Buttons */}
                <div className="flex space-x-4 min-w-full">
                    {/* Search component */}
                    <Search placeholder={"Search"} />

                    <button
                        className="w-1/2 px-2 py-2 border-4 border-gray-600 text-black text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-white"
                    >
                        Refer Patient +
                    </button>

                    <button
                        className="w-1/2 px-2 py-2 border-4 border-gray-600 text-black text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-white"
                        onClick={handleAddAppointment}
                    >
                        Add Appointment +
                    </button>

                    {/* User Profile Section */}
                    <div className="w-1/2 flex gap-4 items-center justify-end">
                        <div className="w-1/5">
                            <BellIcon className="text-3xl size-7 text-gray-500 mr-2" />
                        </div>
                        <div className="ml-2 text-center">
                            <p className="font-semibold text-nowrap">
                                {firstName}
                            </p>
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
                        <div className="flex items-center justify-center rounded-full border border-black p-1 w-[45px] h-[45px]">
                            {profileImageUrl ? (
                                <Image
                                    src={profileImageUrl}
                                    alt="Profile Picture"
                                    width={45}
                                    height={45}
                                    className="rounded-full"
                                />
                            ) : (
                                <FaUserCircle className=" text-gray-500 rounded-full w-[45px] h-[45px]" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {dialogType === "addAppointment" && (
                <AddAppointmentDialog onClose={handleDialogClose} />
            )}
        </header>
    );
};

export default Header;
