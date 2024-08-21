// src/components/ui/dashboard/Header.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import { FaUserCircle } from "react-icons/fa";
import { BellIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { getFirstName } from "@/lib/utils";
import Skeleton from "@mui/material/Skeleton";
import { useUserProfile } from "@/app/context/ProfileContext";
import Search from "@/components/ui/search";
import dynamic from "next/dynamic";

// Dynamic imports for dialogs
const AddAppointmentDialog = dynamic(() => import("@/components/appointments/AddAppointmentDialog"));
const ReferPatientDialog = dynamic(() => import("@/components/referral/ReferPatientDialog"));

const Header = () => {
    const { data: session } = useSession();
    const { user } = useUserProfile();
    const firstName = session?.user ? getFirstName(session.user.username) : "";
    const nameWidth = firstName ? firstName.length * 10 : 100;
    const profileImageUrl = user?.imageUrl;
    const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
    const [openReferDialog, setOpenReferDialog] = useState(false);

    const handleAddAppointment = () => {
        setOpenAppointmentDialog(true);
    };

    const handleReferPatient = () => {
        setOpenReferDialog(true);
    };

    const handleDialogClose = () => {
        setOpenAppointmentDialog(false);
        setOpenReferDialog(false);
    };

    const role = session?.user?.role

    // console.log(role)

    return (
        <header className="flex z-10 fixed top-0 left-0 w-full items-center justify-between p-4 py-5 m-2 bg-white shadow-lg shadow-gray-300 rounded-2xl">
            {/* Logo */}
            <div className="flex items-center w-1/4">
                <Image src={logo} alt="Hospital Logo" width={120} height={40} />
            </div>

            <div className="flex justify-between w-3/4 gap-4">
                {/* Center Buttons */}
                <div className="flex space-x-4 min-w-full justify-between">
                    <div className="w-full flex justify-between gap-2">
                        {/* Search component */}
                        <Search placeholder={"Search"} />

                        {/* Conditionally render Refer Patient button */}
                        {role === "DOCTOR" || role === "NURSE" ? (
                            <button
                                className="w-1/2 px-2 py-2 border-4 border-gray-600 text-black text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-white"
                                onClick={handleReferPatient}
                            >
                                Refer Patient +
                            </button>
                        ) : null}

                        <button
                            className=" w-1/2 px-2 py-2 border-4 border-gray-600 text-black text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-white"
                            onClick={handleAddAppointment}
                        >
                            Add Appointment +
                        </button>
                    </div>

                    {/* User Profile Section */}
                    <div className="w-1/4 flex gap-4 items-center justify-end">
                        <div className="w-1/5">
                            <BellIcon className="text-3xl size-7 text-gray-500 mr-2" />
                        </div>
                        <div className="ml-2 text-center">
                            <p className="font-semibold text-nowrap">
                                {firstName}
                            </p>
                            {session?.user ? (
                                <p className="text-xs text-nowrap text-gray-400">
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

            {openAppointmentDialog && (
                <AddAppointmentDialog onClose={handleDialogClose} />
            )}
            {openReferDialog && (
                <ReferPatientDialog onClose={handleDialogClose} />
            )}
        </header>
    );
};

export default Header;
