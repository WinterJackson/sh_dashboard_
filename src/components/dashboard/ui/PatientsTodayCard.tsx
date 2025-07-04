// src/components/dashboard/ui/PatientsTodayCard.tsx

"use client";

import React from "react";
import icon from "../../../../public/images/patient.svg";
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

interface PatientsTodayCardProps {
    uniquePatientsTodayCount: number;
    percentageChange: number | null;
}

const PatientsTodayCard: React.FC<PatientsTodayCardProps> = ({
    uniquePatientsTodayCount,
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
                    Patients Today
                </h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={14} className="text-text-muted" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Shows the number of unique patients seen today.
                                <br />
                                <br />
                                The percentage compares unique patients this
                                week vs last week.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center justify-between gap-6">
                <div>
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-two text-foreground ${getFontSizeClass(
                            uniquePatientsTodayCount.toString().length
                        )}`}
                    >
                        {uniquePatientsTodayCount}
                    </span>
                </div>
                <div className="flex w-1/3 items-center justify-end h-3/4 relative">
                    <Image
                        src={icon}
                        alt="patient icon"
                        className="p-2 mb-2 rounded-full bg-primary/40"
                        width={100}
                        height={100}
                    />
                </div>
            </div>

            <div>
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

                <div className="flex items-center justify-between">
                    <p className="text-[11px] sm:text-xs md:text-sm xl:text-sm">
                        Since Last Week
                    </p>
                    <Link
                        href="/dashboard/patients"
                        className="text-xs sm:text-sm text-primary hover:bg-primary hover:text-primary-foreground rounded-[5px] p-1"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PatientsTodayCard;
