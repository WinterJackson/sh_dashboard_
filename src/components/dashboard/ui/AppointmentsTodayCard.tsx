// File: src/components/dashboard/ui/AppointmentsTodayCard.tsx

"use client";

import React, { useMemo } from "react";
import icon from "../../../../public/images/appointment.svg";
import Image from "next/image";
import Link from "next/link";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from '@radix-ui/react-icons';

interface AppointmentsTodayCardProps {
    appointmentsTodayCount: number;
    last14DaysAppointments: { appointmentDate: Date }[];
}

const AppointmentsTodayCard: React.FC<AppointmentsTodayCardProps> = ({
    appointmentsTodayCount,
    last14DaysAppointments,
}) => {
    const percentageChange = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const appointmentCounts = Array(14).fill(0);

        last14DaysAppointments.forEach((appointment) => {
            const date = new Date(appointment.appointmentDate);
            const diff = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
            const dayIndex = Math.floor(diff);
            if (dayIndex >= 0 && dayIndex < 14) {
                appointmentCounts[dayIndex]++;
            }
        });

        const currentWeekCount = appointmentCounts.slice(0, 7).reduce((sum, count) => sum + count, 0);
        const previousWeekCount = appointmentCounts.slice(7, 14).reduce((sum, count) => sum + count, 0);

        return previousWeekCount > 0
            ? ((currentWeekCount - previousWeekCount) / previousWeekCount) * 100
            : 0;
    }, [last14DaysAppointments]);

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
            <div className="text-sm xl:text-base font-semibold">Appointments Today</div>
            <div className="flex items-center justify-between gap-6">
                <div>
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
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
                        className="p-2 mb-2 rounded-full bg-[#FE56D6]/40"
                        width={100}
                        height={100}
                    />
                </div>
            </div>
            <div>
                <div
                    className={`flex items-center ${
                        percentageChange >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                >
                    {percentageChange > 0 && <ArrowTopRightIcon />}
                    {percentageChange < 0 && <ArrowBottomRightIcon />}
                    <span className="text-md xl:text-xl">{percentageChange.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[12px] xl:text-sm">Since Last Week</p>
                    <Link
                        href="/dashboard/appointments"
                        className="text-sm xl:text-sm text-primary hover:bg-primary hover:text-white rounded-[5px] p-1"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsTodayCard;
