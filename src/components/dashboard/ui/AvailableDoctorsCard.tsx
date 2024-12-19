// File: src/components/dashboard/ui/AvailableDoctorsCard.tsx

"use client";

import { Role } from "@/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import icon from "../../../../public/images/doctor.svg";

interface AvailableDoctorsCardProps {
    session: {
        user: {
            role: Role;
            hospitalId: number | null;
        };
    };
    onlineDoctorsCount: number
}

const AvailableDoctorsCard: React.FC<AvailableDoctorsCardProps> = ({
    session,
    onlineDoctorsCount,
}) => {

    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 3) return "text-4xl xl:text-6xl";
        if (numDigits <= 4) return "text-3xl xl:text-6xl";
        if (numDigits <= 5) return "text-2xl xl:text-5xl";
        if (numDigits <= 6) return "text-xl xl:text-5xl";
        if (numDigits <= 7) return "text-l xl:text-5xl";
        return "text-base";
    };

    return (
        <div className="grid p-4 rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <div className="flex">
                <h3 className="text-sm pl-1 xl:text-base font-semibold mb-6">
                    Available Doctors
                </h3>
            </div>
            <div className="flex items-center justify-between gap-6">
                <div>
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
                            onlineDoctorsCount
                        )}`}
                    >
                        {onlineDoctorsCount}
                    </span>
                </div>
                <div className="flex w-1/3 items-center justify-end h-3/4 relative">
                    <Image
                        src={icon}
                        alt="doctor icon"
                        className="p-2 rounded-full bg-primary/40"
                        width={100}
                        height={100}
                    />
                </div>
            </div>
            {session.user.role !== "STAFF" && (
                <div className="flex bg-red mt-5 items-center justify-between">
                    <p className="text-sm xl:text-sm pl-1">Online</p>
                    <Link
                        href="/dashboard/doctors"
                        className="p-1 rounded-[5px] text-sm xl:text-sm h-auto text-primary hover:bg-primary hover:text-white"
                    >
                        View all
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AvailableDoctorsCard;
