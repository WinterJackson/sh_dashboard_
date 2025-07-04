// src/components/header/ui/Header.tsx

"use client";

import Search from "@/components/ui/search";
import Skeleton from "@mui/material/Skeleton";
import { BellIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import logo from "../../../../public/images/logo.png";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import SidebarLinks from "@/components/sidebar/ui/SidebarLinks";
import ThemeToggle from "@/components/sidebar/ui/ThemeToggle";
import LogoutButton from "@/components/sidebar/ui/LogoutButton";
import { Role } from "@/lib/definitions";

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
            <header className="fixed top-2 left-4 right-4 z-30 flex items-center justify-between px-4 sm:px-6 lg:px-8 py-5 bg-background shadow-md shadow-shadow-main rounded-2xl">
                {/* Mobile: Hamburger icon and profile */}
                <div className="flex items-center justify-between w-full md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="focus:outline-none">
                                <HamburgerMenuIcon className="w-6 h-6 text-text-main" />
                            </button>
                        </SheetTrigger>

                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle className="text-base font-bold">
                                    Menu
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-2">
                                <SidebarLinks role={role as Role} />

                                {role === "DOCTOR" || role === "NURSE" ? (
                                    <button
                                        onClick={handleReferPatient}
                                        className="mt-6 w-[90%] border-t border-r border-b border-border px-4 py-2 text-xs rounded-r-[10px] bg-slate-two hover:bg-primary hover:text-primary-foreground"
                                    >
                                        Refer Patient +
                                    </button>
                                ) : null}

                                {role !== "STAFF" && (
                                    <button
                                        onClick={handleAddAppointment}
                                        className="mt-2 w-[90%] border-t border-r border-b border-border px-4 py-2 text-xs rounded-r-[10px] bg-slate-two hover:bg-primary hover:text-primary-foreground"
                                    >
                                        Add Appointment +
                                    </button>
                                )}
                            </div>
                            <SheetFooter>
                                <div className="mt-8 flex flex-col gap-4">
                                    <ThemeToggle />
                                    <LogoutButton />
                                </div>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>

                    <div className="flex items-center justify-center rounded-full w-10 h-10 overflow-hidden">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={`${username} avatar`}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover rounded-full border-2 border-border"
                            />
                        ) : (
                            <FaUserCircle className="text-text-muted w-full h-full" />
                        )}
                    </div>
                </div>

                {/* Logo on md+ */}
                <div className="hidden md:flex items-center w-1/4">
                    <Image
                        src={logo}
                        alt="Hospital Logo"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                </div>

                {/* Center and Right content for md+ */}
                <div className="hidden md:flex justify-between w-3/4 gap-4">
                    <div className="flex space-x-4 min-w-full justify-between">
                        <div className="w-full flex justify-between gap-2">
                            <Search placeholder={"Search"} />

                            {role === "DOCTOR" || role === "NURSE" ? (
                                <button
                                    className="w-1/2 px-2 py-2 border-4 border-alt-border text-text-main text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-primary-foreground"
                                    onClick={handleReferPatient}
                                >
                                    Refer Patient +
                                </button>
                            ) : null}

                            {role !== "STAFF" && (
                                <button
                                    className="w-1/2 px-2 py-2 border-4 border-alt-border text-text-main text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-primary-foreground"
                                    onClick={handleAddAppointment}
                                >
                                    Add Appointment +
                                </button>
                            )}
                        </div>

                        <div className="w-1/4 flex gap-4 items-center justify-end">
                            <div className="w-1/5">
                                <BellIcon className="text-3xl size-7 text-text-muted mr-2" />
                            </div>
                            <div className="ml-2 text-center">
                                {username !== "Guest User" &&
                                role !== "Guest" ? (
                                    <>
                                        <p className="font-semibold text-nowrap uppercase">
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
                            <div className="flex items-center justify-center rounded-full w-[55px] h-[55px] overflow-hidden">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={`${username} avatar`}
                                        width={55}
                                        height={55}
                                        className="w-full h-full object-cover rounded-full border-4 border-border"
                                    />
                                ) : (
                                    <FaUserCircle className="text-text-muted w-[55px] h-[55px]" />
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
