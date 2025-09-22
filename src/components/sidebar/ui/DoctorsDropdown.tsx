// src/components/sidebars/ui/DoctorsDropdown.tsx

"use client";

import { useState } from "react";
import { ChevronRightIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import React from "react";

type DoctorsDropdownProps = {
    isActive: (href: string) => boolean;
    currentPath?: string;
};

const DoctorsDropdown: React.FC<DoctorsDropdownProps> = React.memo(({ isActive }) => {
    const [isDoctorsOpen, setIsDoctorsOpen] = useState(false);

    const toggleDoctors = () => {
        setIsDoctorsOpen(!isDoctorsOpen);
    };

    return (
        <>
            <div
                onClick={toggleDoctors}
                className="py-2 px-4 pt-4 pb-4 font-semibold flex items-center cursor-pointer hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm border-b border-t border-border"
            >
                <div className="flex items-center text-xs sm:text-sm">
                    <PersonIcon className="mr-2" />
                    Doctors
                </div>
                <ChevronRightIcon
                    className={`ml-auto text-xl transform transition-transform duration-300 ${
                        isDoctorsOpen ? "rotate-90" : ""
                    }`}
                />
            </div>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isDoctorsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <div className="ml-10 flex flex-col space-y-2 py-2">
                    <Link
                        href="/dashboard/doctors"
                        className={`relative py-2 pl-10 pr-4 font-semibold flex items-center rounded-l-[15px] rounded-r-none text-xs sm:text-sm ${
                            isActive("/dashboard/doctors")
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                        <span
                            className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
                                isActive("/dashboard/doctors")
                                    ? "bg-background-muted border-8 border-constructive"
                                    : "bg-background-muted border-8 border-primary"
                            }`}
                        ></span>
                        All Doctors
                    </Link>
                    <Link
                        href="/dashboard/doctors/add-new-doctor"
                        className={`relative py-2 pl-10 pr-4 font-semibold flex items-center rounded-l-[15px] rounded-r-none text-xs sm:text-sm ${
                            isActive("/dashboard/doctors/add-new-doctor")
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                        <span
                            className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
                                isActive("/dashboard/doctors/add-new-doctor")
                                    ? "bg-background-muted border-8 border-constructive"
                                    : "bg-background-muted border-8 border-primary"
                            }`}
                        ></span>
                        Add New Doctor
                    </Link>
                </div>
            </div>
        </>
    );
});

export default DoctorsDropdown;
