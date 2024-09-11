// File: src/components/dashboard/AppointmentsTodayCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { fetchAppointmentsForLast14Days, fetchTodayAppointments } from "@/lib/data";
import icon from "../../../public/images/appointment.svg";
import Image from "next/image";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from '@radix-ui/react-icons';
import { useSessionData } from "@/hooks/useSessionData";

const AppointmentsTodayCard = () => {
    const [appointmentsToday, setAppointmentsToday] = useState(0);
    const [percentageChange, setPercentageChange] = useState<number>(0);
    const sessionData = useSessionData();

    const role = sessionData?.user?.role;
    const hospitalId = sessionData?.user?.hospitalId;

    useEffect(() => {
        const fetchAppointmentsData = async () => {
            const appointments = await fetchAppointmentsForLast14Days();
            const todayAppointments = await fetchTodayAppointments();

            // Filter today's appointments based on user role
            const filteredTodayAppointments = role === "SUPER_ADMIN"
                ? todayAppointments
                : todayAppointments.filter(
                    (appointment: { hospitalId: number }) => appointment.hospitalId === hospitalId
                );

            const todayAppointmentsCount = filteredTodayAppointments.length;
            setAppointmentsToday(todayAppointmentsCount);

            // Get current date set to midnight
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const appointmentCounts = Array(14).fill(0);

            // Filter and map appointments based on the user's role
            const filteredAppointments = role === "SUPER_ADMIN"
                ? appointments
                : appointments.filter(
                    (appointment: { hospitalId: number }) => appointment.hospitalId === hospitalId
                );

            filteredAppointments.forEach((appointment: { appointmentDate: string | number | Date; }) => {
                const date = new Date(appointment.appointmentDate);
                const diff = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
                const dayIndex = Math.floor(diff);
                if (dayIndex >= 0 && dayIndex < 14) {
                    appointmentCounts[dayIndex]++;
                }
            });

            const currentWeekCount = appointmentCounts.slice(0, 7).reduce((sum, count) => sum + count, 0);
            const previousWeekCount = appointmentCounts.slice(7, 14).reduce((sum, count) => sum + count, 0);

            let percentage = 0;
            if (previousWeekCount > 0) {
                const change = currentWeekCount - previousWeekCount;
                percentage = (change / previousWeekCount) * 100;

                setPercentageChange(percentage);
            }
        };

        // Fetch data only when session data is available
        if (role) {
            fetchAppointmentsData();
        }
    }, [role, hospitalId]);

    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 3) return "text-4xl xl:text-6xl";
        else if (numDigits <= 4) return "text-3xl xl:text-6xl";
        else if (numDigits <= 5) return "text-2xl xl:text-5xl";
        else if (numDigits <= 6) return "text-xl xl:text-5xl";
        else if (numDigits <= 7) return "text-l xl:text-5xl";
        else return "text-base";
    };

    return (
        <div className="grid gap-4 p-4 bg-slate-100 shadow-lg shadow-gray-300 rounded-2xl">
            <div className="text-sm xl:text-base font-semibold">
                Appointments Today
            </div>
            <div className="flex items-center justify-between gap-6">
                <div className="">
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
                            appointmentsToday.toString().length
                        )}`}
                    >
                        4{appointmentsToday}
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
                        percentageChange >= 0
                            ? "text-green-500"
                            : "text-red-500"
                    }`}
                >
                    {percentageChange > 0 && <ArrowTopRightIcon />}
                    {percentageChange < 0 && <ArrowBottomRightIcon />}
                    <span className="text-md xl:text-xl">
                        3{percentageChange.toFixed(1)}%
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-[12px] xl:text-sm">Since Last Week</p>
                    <p className="text-sm xl:text-sm text-primary hover:bg-primary hover:text-white rounded-[5px] p-1">
                        View all
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AppointmentsTodayCard;
