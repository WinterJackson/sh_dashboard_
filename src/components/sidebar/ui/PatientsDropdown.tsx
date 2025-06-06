// src/components/sidebars/ui/PatientsDropdown.tsx

"use client";

import { useState } from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Role } from "@/lib/definitions";

type PatientsDropdownProps = {
    isActive: (href: string) => boolean;
    role?: Role;
};

const PatientsDropdown: React.FC<PatientsDropdownProps> = ({
    isActive,
    role,
}) => {
    const [isPatientsOpen, setIsPatientsOpen] = useState(false);

    const togglePatients = () => {
        setIsPatientsOpen(!isPatientsOpen);
    };

    // roles that can add new patients
    const canAddPatients = [
        Role.SUPER_ADMIN,
        Role.ADMIN,
        Role.DOCTOR,
        Role.NURSE,
        Role.STAFF,
    ].includes(role as Role);

    return (
        <>
            <div
                onClick={togglePatients}
                className="py-2 px-4 pt-4 pb-4 font-semibold flex items-center cursor-pointer hover:bg-bluelight hover:text-black"
            >
                <div className="flex items-center">
                    <PersonIcon className="mr-2 text-xl" />
                    Patients
                </div>
                <ChevronRightIcon
                    className={`ml-auto text-xl transform transition-transform duration-300 ${
                        isPatientsOpen ? "rotate-90" : ""
                    }`}
                />
            </div>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isPatientsOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="ml-10 flex flex-col space-y-2 py-2">
                    <Link
                        href="/dashboard/patients"
                        className={`relative py-2 pl-10 pr-4 font-semibold flex items-center rounded-l-[15px] rounded-r-none ${
                            isActive("/dashboard/patients")
                                ? "bg-primary text-white"
                                : "hover:bg-bluelight hover:text-black"
                        }`}
                    >
                        <span
                            className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
                                isActive("/dashboard/patients")
                                    ? "bg-white border-8 border-green-500"
                                    : "bg-white border-8 border-primary"
                            }`}
                        ></span>
                        All Patients
                    </Link>
                    {canAddPatients && (
                        <Link
                            href="/dashboard/patients/add-new-patient"
                            className={`relative py-2 pl-10 pr-4 font-semibold flex items-center rounded-l-[15px] rounded-r-none ${
                                isActive("/dashboard/patients/add-new-patient")
                                    ? "bg-primary text-white"
                                    : "hover:bg-bluelight hover:text-black"
                            }`}
                        >
                            <span
                                className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
                                    isActive(
                                        "/dashboard/patients/add-new-patient"
                                    )
                                        ? "bg-white border-8 border-green-500"
                                        : "bg-white border-8 border-primary"
                                }`}
                            ></span>
                            Add New Patient
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default PatientsDropdown;
