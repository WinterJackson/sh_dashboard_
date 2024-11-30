// src/components/ui/dashboard/Header.tsx

import React from "react";
import Image from "next/image";
import logo from "../../../public/images/logo.png";
import { FaUserCircle } from "react-icons/fa";
import { BellIcon } from "@radix-ui/react-icons";
import Search from "@/components/ui/search";

type HeaderProps = {
    profileData: {
        firstName: string;
        user: {
            role: string;
        };
        imageUrl: string | null;
    } | null;
    onAddAppointment: () => void;
    onReferPatient: () => void;
};

const Header: React.FC<HeaderProps> = ({ profileData, onAddAppointment, onReferPatient }) => {
    const firstName = profileData ? profileData.firstName : "";
    const profileImageUrl = profileData?.imageUrl;
    const role = profileData?.user?.role;

    return (
        <header className="flex z-10 fixed top-0 left-0 w-full items-center justify-between p-4 py-5 m-2 bg-white shadow-lg shadow-gray-300 rounded-2xl">
            {/* Logo */}
            <div className="flex items-center w-1/4">
                <Image src={logo} alt="Hospital Logo" width={120} height={40} />
            </div>

            <div className="flex justify-between w-3/4 gap-4">
                <div className="flex space-x-4 min-w-full justify-between">
                    <div className="w-full flex justify-between gap-2">
                        <Search placeholder={"Search"} />

                        {role === "DOCTOR" || role === "NURSE" ? (
                            <button
                                className="w-1/2 px-2 py-2 border-4 border-gray-600 text-black text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-white"
                                onClick={onReferPatient}
                            >
                                Refer Patient +
                            </button>
                        ) : null}

                        {role !== "STAFF" && (
                            <button
                                className="w-1/2 px-2 py-2 border-4 border-gray-600 text-black text-xs font-semibold rounded-2xl hover:bg-primary hover:border-primary hover:text-white"
                                onClick={onAddAppointment}
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
                            <p className="font-semibold text-nowrap">{firstName}</p>
                            {role && <p className="text-xs text-nowrap text-gray-400">{role}</p>}
                        </div>
                        <div className="flex items-center justify-center rounded-full w-[55px] h-[55px]">
                            {profileImageUrl ? (
                                <Image
                                    src={profileImageUrl}
                                    alt="Profile Picture"
                                    width={55}
                                    height={55}
                                    className="rounded-full border-4 border-gray-300"
                                />
                            ) : (
                                <FaUserCircle className="text-gray-500 rounded-full w-[55px] h-[55px]" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;