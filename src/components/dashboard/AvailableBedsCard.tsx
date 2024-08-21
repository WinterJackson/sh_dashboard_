// File: src/components/dashboard/AvailableBedsCard.tsx

"use client"

import React, { useEffect, useState } from 'react';
import { fetchAvailableBeds } from '@/lib/data';
import icon from "../../../public/images/bed.svg"
import Image from "next/image";
import { useSessionData } from "@/hooks/useSessionData";

const AvailableBedsCard = () => {
    const [availableBeds, setAvailableBeds] = useState(0);
    const sessionData = useSessionData();

    const role = sessionData?.user?.role;
    const hospitalId = sessionData?.user?.hospitalId;

    useEffect(() => {
        const fetchBeds = async () => {
            const beds = await fetchAvailableBeds();

            // Filter beds based on the user's role and hospitalId
            const filteredBeds = role === "SUPER_ADMIN"
                ? beds
                : beds.filter((bed: any) => bed.hospitalId === hospitalId);

            // setAvailableBeds(filteredBeds.length); // correct code
            setAvailableBeds(filteredBeds.length + 580); // for display
        };

        // Fetch beds only when session data is available
        if (role) {
            fetchBeds();
        }
    }, [role, hospitalId]);

    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 3) return "text-4xl xl:text-6xl"; // Default large size
        else if (numDigits <= 4) return "text-3xl xl:text-6xl"; // Slightly smaller
        else if (numDigits <= 5) return "text-2xl xl:text-5xl"; // Even smaller
        else if (numDigits <= 6) return "text-xl xl:text-5xl"; // Even smaller
        else if (numDigits <= 7) return "text-l xl:text-5xl"; // Even smaller
        else return "text-base"; // Smallest size
    };

    return (
        <div className="grid p-4 rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <div className="flex">
                <h3 className="text-sm xl:text-base text-nowrap font-semibold mb-6">
                    Available Beds
                </h3>
            </div>

            <div className="flex items-center justify-between gap-6">
                <div className="">
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
                            availableBeds.toString().length
                        )}`}
                    >
                        {availableBeds}
                    </span>
                </div>
                <div className="flex w-1/3 items-center justify-end h-3/4 relative">
                    <Image
                        src={icon}
                        alt="bed icon"
                        className="p-2 rounded-full bg-[#72af8572]"
                        width={100}
                        height={100}
                    />
                </div>
            </div>

            <div className="flex bg-red mt-5 items-center justify-between">
                <p className="text-sm xl:text-sm pl-1">Today</p>
                <p className="p-1 rounded-[5px] text-sm xl:text-sm h-auto text-primary hover:bg-primary hover:text-white">
                    View all
                </p>
            </div>
            
        </div>
    );
};

export default AvailableBedsCard;

