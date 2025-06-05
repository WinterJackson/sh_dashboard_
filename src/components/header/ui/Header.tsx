// src/components/header/ui/Header.tsx

"use client";

import Search from "@/components/ui/search";
import Skeleton from "@mui/material/Skeleton";
import { BellIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../../../public/images/logo.png";

const AddAppointmentDialog = dynamic(
    () =>
        import(
            "@/components/appointments/ui/appointment-modals/AddAppointmentDialog"
        )
);
const ReferPatientDialog = dynamic(
    () => import("@/components/referral/ReferPatientDialog")
);

type HeaderProps = {
    username: string;
    role: string;
    imageUrl?: string;
};

const Header: React.FC<HeaderProps> = ({ username, role, imageUrl }) => {
    const [openAppointmentDialog, setOpenAppointmentDialog] = useState(false);
    const [openReferDialog, setOpenReferDialog] = useState(false);

    const handleAddAppointment = () => setOpenAppointmentDialog(true);
    const handleReferPatient = () => setOpenReferDialog(true);
    const handleDialogClose = () => {
        setOpenAppointmentDialog(false);
        setOpenReferDialog(false);
    };

    const firstName = username.split(" ")[0] || "";
    const nameWidth = firstName ? firstName.length * 10 : 100;

    return (
        <>
            <header className="flex z-30 fixed top-0 left-0 w-full items-center justify-between p-4 py-5 m-2 bg-white shadow-lg shadow-gray-300 rounded-2xl">
                {/* Logo */}
                <div className="flex items-center w-1/4">
                    <Image
                        src={logo}
                        alt="Hospital Logo"
                        width={120}
                        height={40}
                    />
                </div>

                <div className="flex justify-between w-3/4 gap-4">
                    <div className="flex space-x-4 min-w-full justify-between">
                        <div className="w-full flex justify-between gap-2">
                            <Search placeholder={"Search"} />

                            {role === "DOCTOR" || role === "NURSE" ? (
                                <button
                                    className="w-1/2 px-2 py-2 border-4 border-gray-600 text-black text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-white"
                                    onClick={handleReferPatient}
                                >
                                    Refer Patient +
                                </button>
                            ) : null}

                            {role !== "STAFF" && (
                                <button
                                    className="w-1/2 px-2 py-2 border-4 border-gray-600 text-black text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-white"
                                    onClick={handleAddAppointment}
                                >
                                    Add Appointment +
                                </button>
                            )}
                        </div>

                        <div className="w-1/4 flex gap-4 items-center justify-end">
                            <div className="w-1/5">
                                <BellIcon className="text-3xl size-7 text-gray-500 mr-2" />
                            </div>
                            <div className="ml-2 text-center">
                                {username !== "Guest User" &&
                                role !== "Guest" ? (
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
                            <div className="flex items-center justify-center rounded-full w-[55px] h-[55px] overflow-hidden">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={`${username} avatar`}
                                        width={55}
                                        height={55}
                                        className="w-full h-full object-cover rounded-full border-4 border-gray-300"
                                    />
                                ) : (
                                    <FaUserCircle className="text-gray-500 w-[55px] h-[55px]" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {openAppointmentDialog && (
                <AddAppointmentDialog
                    onClose={handleDialogClose}
                    open={openAppointmentDialog}
                />
            )}
            {openReferDialog && (
                <ReferPatientDialog onClose={handleDialogClose} />
            )}
        </>
    );
};

export default Header;
