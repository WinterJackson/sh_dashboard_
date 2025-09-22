// src/components/dashboard/ui/AppointmentsTodayCard.tsx

"use client";

import React from "react";
import icon from "../../../../public/images/appointment.svg";
import Image from "next/image";
import Link from "next/link";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from "@radix-ui/react-icons";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface AppointmentsTodayCardProps {
    appointmentsTodayCount: number;
    percentageChange: number | null;
}

const AppointmentsTodayCard: React.FC<AppointmentsTodayCardProps> = ({
    appointmentsTodayCount,
    percentageChange,
}) => {
    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 4)
            return "text-2xl sm:text-3xl md:text-4xl xl:text-5xl";
        if (numDigits <= 5)
            return "text-xl sm:text-2xl md:text-3xl xl:text-5xl";
        if (numDigits <= 6) return "text-lg sm:text-xl md:text-2xl xl:text-4xl";
        if (numDigits <= 7)
            return "text-base sm:text-lg md:text-xl xl:text-4xl";
        if (numDigits <= 8)
            return "text-sm sm:text-base md:text-lg xl:text-4xl";
        return "text-sm sm:text-base";
    };

    return (
        <div className="grid gap-4 p-4 bg-card shadow-md shadow-shadow-main rounded-2xl cursor-pointer">
            <div className="flex items-center gap-1">
                <h3 className="text-xs sm:text-sm md:text-sm lg:text-base font-semibold">
                    Appointments Today
                </h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={14} className="text-text-muted" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Shows today's total appointments.
                                <br />
                                <br />
                                The percentage change compares this week's total
                                vs last week's.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center justify-between gap-6">
                <div>
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-two text-foreground ${getFontSizeClass(
                            appointmentsTodayCount.toString().length
                        )}`}
                    >
                        {appointmentsTodayCount}
                    </span>
                </div>
                <div className="flex w-1/3 items-center justify-end h-3/4 relative">
                    <Image
                        src={icon}
                        alt="appointment icon"
                        className="p-2 mb-2 rounded-full bg-primary/40"
                        width={100}
                        height={100}
                    />
                </div>
            </div>

            <div className="cursor-pointer">
                {percentageChange !== null ? (
                    <div
                        className={`flex items-center ${
                            percentageChange >= 0
                                ? "text-constructive"
                                : "text-destructive"
                        }`}
                    >
                        {percentageChange > 0 && <ArrowTopRightIcon />}
                        {percentageChange < 0 && <ArrowBottomRightIcon />}
                        <span className="text-sm sm:text-base md:text-lg xl:text-xl">
                            {percentageChange.toFixed(1)}%
                        </span>
                    </div>
                ) : (
                    <div className="text-text-muted text-xs sm:text-sm md:text-base">
                        No data from previous week
                    </div>
                )}

                <div className="flex items-center justify-between mt-2">
                    <p className="text-[11px] sm:text-xs md:text-sm xl:text-sm">
                        Since Last Week
                    </p>
                    <Link
                        href="/dashboard/appointments"
                        className="text-xs sm:text-sm text-primary hover:bg-primary hover:text-primary-foreground rounded-[5px] p-1"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default React.memo(AppointmentsTodayCard);
