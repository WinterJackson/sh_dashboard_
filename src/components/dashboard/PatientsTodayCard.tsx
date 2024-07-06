// src/components/dashboard/PatientsTodayCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import icon from "../../../public/images/patient.svg";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from "@radix-ui/react-icons";

const PatientsTodayCard = () => {
    const [patientsToday, setPatientsToday] = useState(0);
    const [percentageChange, setPercentageChange] = useState<number | null>(null);

    useEffect(() => {
        const fetchPatientsToday = async () => {
            try {
                const response = await fetch("/api/patients/today");
                if (!response.ok) {
                    throw new Error(`Error fetching today's patients: ${response.statusText}`);
                }
                const data = await response.json();
                setPatientsToday(data.count);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchPatientsForLast14Days = async () => {
            try {
                const response = await fetch("/api/patients/lastfortnight");
                if (!response.ok) {
                    throw new Error(`Error fetching patients for the last 14 days: ${response.statusText}`);
                }
                const appointments = await response.json();

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

                const currentWeekCount = Object.values(patientCounts).slice(0, 7).reduce((sum, set) => sum + set.size, 0);
                const previousWeekCount = Object.values(patientCounts).slice(7, 14).reduce((sum, set) => sum + set.size, 0);

                if (previousWeekCount > 0) {
                    const change = currentWeekCount - previousWeekCount;
                    const percentage = (change / previousWeekCount) * 100;
                    setPercentageChange(percentage);
                } else {
                    setPercentageChange(null);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPatientsToday();
        fetchPatientsForLast14Days();
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
        <div className="flex rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <div className="flex justify-between flex-col w-3/5 card p-4 pr-1">
                <h3 className="text-xs pl-1 xl:text-base text-nowrap font-semibold mb-6">
                    Patients Today
                </h3>
                <div className="mb-8">
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
                            patientsToday.toString().length
                        )}`}
                    >
                        {patientsToday}
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
                                <ArrowTopRightIcon />
                            ) : (
                                <ArrowBottomRightIcon />
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
                        alt="patient icon"
                        className="p-3 mb-2 rounded-full bg-[#C346F2]/40"
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

export default PatientsTodayCard;
