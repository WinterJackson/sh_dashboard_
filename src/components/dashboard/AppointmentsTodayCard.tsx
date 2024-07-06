// File: src/components/dashboard/AppointmentsTodayCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { fetchAppointmentsForLast14Days, fetchTodayAppointments } from "@/lib/data";
import icon from "../../../public/images/appointment.svg";
import Image from "next/image";
import { ArrowTopRightIcon } from '@radix-ui/react-icons';
import { ArrowBottomRightIcon } from '@radix-ui/react-icons';

const AppointmentsTodayCard = () => {
    const [appointmentsToday, setAppointmentsToday] = useState(0);
    const [percentageChange, setPercentageChange] = useState<number | null>(null);

    useEffect(() => {
        const fetchAppointmentsData = async () => {
            const appointments = await fetchAppointmentsForLast14Days();
            const todayAppointmentsCount = await fetchTodayAppointments();

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const appointmentCounts = Array(14).fill(0);

            appointments.forEach((appointment: { appointmentDate: string | number | Date; }) => {
                const date = new Date(appointment.appointmentDate);
                const diff = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
                const dayIndex = Math.floor(diff);
                if (dayIndex >= 0 && dayIndex < 14) {
                    appointmentCounts[dayIndex]++;
                }
            });

            const currentWeekCount = appointmentCounts.slice(0, 7).reduce((sum, count) => sum + count, 0);
            const previousWeekCount = appointmentCounts.slice(7, 14).reduce((sum, count) => sum + count, 0);

            setAppointmentsToday(todayAppointmentsCount);

            if (previousWeekCount > 0) {
                const change = currentWeekCount - previousWeekCount;
                const percentage = (change / previousWeekCount) * 100;
                setPercentageChange(percentage);
            }
        };

        fetchAppointmentsData();
    }, []);

    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 3) return "text-4xl xl:text-6xl"; // Default large size
        else if (numDigits <= 4) return "text-3xl xl:text-6xl"; // Slightly smaller
        else if (numDigits <= 5) return "text-2xl xl:text-5xl"; // Even smaller
        else if (numDigits <= 6) return "text-xl xl:text-5xl"; // Even smaller
        else if (numDigits <= 7) return "text-l xl:text-5xl"; // Even smaller
        else return "text-base"; // Smallest size
    };

    return (
        <div className="flex justify-center rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <div className="flex justify-center flex-col w-3/5 card p-4 pr-1">
                <h3 className="text-xs xl:text-base text-nowrap font-semibold mb-6">
                    Appointments Today
                </h3>
                <div className="mb-8">
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
                            appointmentsToday.toString().length
                        )}`}
                    >
                        {appointmentsToday}
                    </span>
                </div>
                {percentageChange !== null && (
                    <>
                        <p
                            className={`text-md xl:text-xl flex gap-1 items-center hover:scale-110 transition duration-200 ease-in-out ${
                                percentageChange >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            {percentageChange >= 0 ? (
                                <>
                                    <ArrowTopRightIcon />
                                </>
                            ) : (
                                <>
                                    <ArrowBottomRightIcon />
                                </>
                            )}
                            {percentageChange.toFixed(1)}%
                        </p>
                        <p className="text-[11px] xl:text-sm"> Since Last Week</p>
                    </>
                )}
            </div>
            <div className="flex flex-col items-center justify-center w-2/5 card mr-5">
                <div className="flex w-full items-center justify-center h-3/4 relative">
                    <Image
                        src={icon}
                        alt="appointment icon"
                        className="p-2 mb-2 rounded-full bg-[#FE56D6]/40"
                        width={100}
                        height={100}
                    />
                </div>
                <p className="flex p-1 rounded-[5px] items-end text-xs xl:text-sm h-auto text-primary hover:bg-primary hover:text-white">
                    View all
                </p>
            </div>
        </div>
    );
};

export default AppointmentsTodayCard;
