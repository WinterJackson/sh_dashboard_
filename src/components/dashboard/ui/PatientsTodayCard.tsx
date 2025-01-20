// File: src/components/dashboard/ui/PatientsTodayCard.tsx

"use client";

import React from "react";
import icon from "../../../../public/images/patient.svg";
import Image from "next/image";
import Link from "next/link";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from "@radix-ui/react-icons";
import { Patient } from "@/lib/definitions";

interface PatientsTodayCardProps {
    uniquePatientsTodayCount: number;
    currentWeekPatients: Patient[];
    previousWeekPatients: Patient[];
}

const PatientsTodayCard: React.FC<PatientsTodayCardProps> = ({
    uniquePatientsTodayCount,
    currentWeekPatients,
    previousWeekPatients,
}) => {
    // Calculate current and previous week counts
    const currentWeekCount = currentWeekPatients.length;
    const previousWeekCount = previousWeekPatients.length;

    let percentageChange = 0;
    let isPositive = true;

    if (previousWeekCount > 0) {
        const change = currentWeekCount - previousWeekCount;
        percentageChange = (change / previousWeekCount) * 100;
        isPositive = change >= 0;
    } else if (currentWeekCount > 0) {
        // No patients in the previous week but patients in the current week
        percentageChange = 100; // 100% increase
        isPositive = true;
    } else if (currentWeekCount === 0 && previousWeekCount > 0) {
        // Patients in the previous week but none in the current week
        percentageChange = -100; // 100% decrease
        isPositive = false;
    } else {
        // No patients in both weeks
        percentageChange = 0;
    }

    // Helper to dynamically set font size based on the number of digits
    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 4) return "text-3xl xl:text-5xl";
        if (numDigits <= 5) return "text-2xl xl:text-5xl";
        if (numDigits <= 6) return "text-xl xl:text-4xl";
        if (numDigits <= 7) return "text-lg xl:text-4xl";
        if (numDigits <= 8) return "text-base xl:text-4xl";
        return "text-base";
    };

    return (
        <div className="grid gap-4 p-4 bg-slate-100 shadow-lg shadow-gray-300 rounded-2xl">
            <div className="text-sm xl:text-base font-semibold">
                Patients Today
            </div>
            <div className="flex items-center justify-between gap-6">
                <div className="">
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
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
                        className="p-2 mb-2 rounded-full bg-[#FE56D6]/40"
                        width={100}
                        height={100}
                    />
                </div>
            </div>
            <div>
                <div
                    className={`flex items-center ${
                        isPositive ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {isPositive ? <ArrowTopRightIcon /> : <ArrowBottomRightIcon />}
                    <span className="text-md xl:text-xl">
                        {percentageChange.toFixed(1)}%
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[12px] xl:text-sm">Since Last Week</p>
                    <Link
                        href="/dashboard/patients"
                        className="text-sm xl:text-sm text-primary hover:bg-primary hover:text-white rounded-[5px] p-1"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PatientsTodayCard;
