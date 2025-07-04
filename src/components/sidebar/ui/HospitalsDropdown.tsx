// src/components/sidebars/ui/HospitalsDropdown.tsx

"use client";

import { useState } from "react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Link from "next/link";
import { Role } from "@/lib/definitions";

type HospitalsDropdownProps = {
    isActive: (href: string) => boolean;
    role?: Role;
};

const HospitalsDropdown: React.FC<HospitalsDropdownProps> = ({
    isActive,
    role,
}) => {
    const [isHospitalsOpen, setIsHospitalsOpen] = useState(false);

    const toggleHospitals = () => {
        setIsHospitalsOpen(!isHospitalsOpen);
    };

    return (
        <>
            <div
                onClick={toggleHospitals}
                className="py-2 px-4 pt-4 pb-4 font-semibold flex items-center cursor-pointer hover:bg-accent hover:text-accent-foreground text-xs sm:text-sm border-b border-t border-border"
            >
                <div className="flex items-center text-xs sm:text-sm">
                    <LocalHospitalIcon className="mr-2 text-sm"/>
                    Hospitals
                </div>
                <ChevronRightIcon
                    className={`ml-auto text-xl transform transition-transform duration-300 ${
                        isHospitalsOpen ? "rotate-90" : ""
                    }`}
                />
            </div>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    isHospitalsOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="ml-10 flex flex-col space-y-2 py-2">
                    <Link
                        href="/dashboard/hospitals"
                        className={`relative py-2 pl-10 pr-4 font-semibold flex items-center rounded-l-[15px] rounded-r-none text-xs sm:text-sm ${
                            isActive("/dashboard/hospitals")
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                        <span
                            className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
                                isActive("/dashboard/hospitals")
                                    ? "bg-background-muted border-8 border-constructive"
                                    : "bg-background-muted border-8 border-primary"
                            }`}
                        ></span>
                        All Hospitals
                    </Link>
                    {role === Role.SUPER_ADMIN && (
                        <Link
                            href="/dashboard/hospitals/add-new-hospital"
                            className={`relative py-2 pl-10 pr-4 font-semibold flex items-center rounded-l-[15px] rounded-r-none text-xs sm:text-sm ${
                                isActive(
                                    "/dashboard/hospitals/add-new-hospital"
                                )
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                        >
                            <span
                                className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full ${
                                    isActive(
                                        "/dashboard/hospitals/add-new-hospital"
                                    )
                                        ? "bg-background-muted border-8 border-constructive"
                                        : "bg-background-muted border-8 border-primary"
                                }`}
                            ></span>
                            Add New Hospital
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
};

export default HospitalsDropdown;
