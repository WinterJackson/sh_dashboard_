// File: src/components/dashboard/PatientsTodayCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { fetchPatientsForLast14Days, fetchPatientsToday } from "@/lib/data";
import icon from "../../../public/images/patient.svg";
import Image from "next/image";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from '@radix-ui/react-icons';

const PatientsTodayCard = () => {
    const [patientsToday, setPatientsToday] = useState(0);
    const [percentageChange, setPercentageChange] = useState<number>(0);

    useEffect(() => {
        const fetchPatientsData = async () => {
            try {
                const appointments = await fetchPatientsForLast14Days();
                const todayPatientsCount = await fetchPatientsToday();

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const patientCounts: { [key: number]: Set<number> } = {};
                for (let i = 0; i < 14; i++) {
                    patientCounts[i] = new Set();
                }

                appointments.forEach((appointment: { appointmentDate: string | number | Date; patientId: number }) => {
                    const date = new Date(appointment.appointmentDate);
                    const diff = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
                    const dayIndex = Math.floor(diff);
                    if (dayIndex >= 0 && dayIndex < 14) {
                        patientCounts[dayIndex].add(appointment.patientId);
                    }
                });

                // const currentWeekCount = Object.values(patientCounts).slice(0, 7).reduce((sum, set) => sum + set.size, 0);
                // const previousWeekCount = Object.values(patientCounts).slice(7, 14).reduce((sum, set) => sum + set.size, 0);

                const currentWeekCount = 14 // test data
                const previousWeekCount = 20 // test data

                // setPatientsToday(todayPatientsCount);

                setPatientsToday(3782); // test data

                if (previousWeekCount > 0) {
                    const change = currentWeekCount - previousWeekCount;
                    const percentage = (change / previousWeekCount) * 100;
                    setPercentageChange(percentage);
                } else {
                    setPercentageChange(0);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPatientsData();
    }, []);

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
                Patients Today
            </div>
            <div className="flex items-center justify-between gap-6">
                <div className="">
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
                            patientsToday.toString().length
                        )}`}
                    >
                        {patientsToday}
                    </span>
                </div>
                <div className="flex w-full items-center justify-end h-3/4 relative">
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
                        percentageChange >= 0
                            ? "text-green-500"
                            : "text-red-500"
                    }`}
                >
                    {percentageChange > 0 && <ArrowTopRightIcon />}
                    {percentageChange < 0 && <ArrowBottomRightIcon />}
                    <span className="text-md xl:text-xl">
                        {percentageChange.toFixed(1)}%
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

export default PatientsTodayCard;
