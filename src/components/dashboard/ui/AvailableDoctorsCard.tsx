// src/components/dashboard/ui/AvailableDoctorsCard.tsx

"use client";

import { Role } from "@/lib/definitions";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import icon from "../../../../public/images/doctor.svg";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface AvailableDoctorsCardProps {
    session: {
        user: {
            role: Role;
            hospitalId: number | null;
        };
    };
    onlineDoctorsCount: number;
}

const AvailableDoctorsCard: React.FC<AvailableDoctorsCardProps> = ({
    session,
    onlineDoctorsCount,
}) => {
    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 4) return "text-2xl sm:text-3xl md:text-4xl xl:text-5xl";
        if (numDigits <= 5) return "text-xl sm:text-2xl md:text-3xl xl:text-5xl";
        if (numDigits <= 6) return "text-lg sm:text-xl md:text-2xl xl:text-4xl";
        if (numDigits <= 7) return "text-base sm:text-lg md:text-xl xl:text-4xl";
        if (numDigits <= 8) return "text-sm sm:text-base md:text-lg xl:text-4xl";
        return "text-sm sm:text-base";
    };

    return (
        <div className="grid p-4 rounded-2xl bg-card shadow-md shadow-shadow-main cursor-pointer">
            <div className="flex items-center gap-1">
                <h3 className="text-xs sm:text-sm md:text-sm lg:text-base font-semibold mb-6">
                    Available Doctors
                </h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1 mb-6">
                            <Info size={14} className="text-text-muted" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>This shows the number of doctors currently online and available for consultations.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex items-center justify-between gap-6">
                <div>
                    <div
                        className={`font-bold p-1 rounded-[10px] bg-slate-two text-foreground ${getFontSizeClass(
                            onlineDoctorsCount.toString().length
                        )}`}
                    >
                        {onlineDoctorsCount}
                    </div>
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
                <div className="flex mt-5 items-center justify-between">
                    <p className="text-xs sm:text-sm text-constructive">Online</p>
                    <Link
                        href="/dashboard/doctors"
                        className="p-1 rounded-[5px] text-xs sm:text-sm text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                        View all
                    </Link>
                </div>
            )}
        </div>
    );
};

export default React.memo(AvailableDoctorsCard);
