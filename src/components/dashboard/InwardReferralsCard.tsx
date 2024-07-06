// File: src/components/dashboard/InwardReferralsCard.tsx

"use client"

import React, { useEffect, useState } from 'react';
import { fetchAvailableBeds } from '@/lib/data';
import icon from "../../../public/images/bed.svg"
import Image from "next/image";

const InwardReferralsCard = () => {
    const [availableBeds, setAvailableBeds] = useState(0);

    useEffect(() => {
        const fetchBeds = async () => {
            const beds = await fetchAvailableBeds();
            setAvailableBeds(beds.length);
        };

        fetchBeds();
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
            <div className="flex justify-between flex-col w-3/5 card p-4 pr-1 ">
                <h3 className="text-xs xl:text-base text-nowrap font-semibold mb-6">
                    Available Beds
                </h3>
                <div className="mb-8">
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
                            availableBeds.toString().length
                        )}`}
                    >
                        {availableBeds}
                    </span>
                </div>
                <p className="text-xs xl:text-sm">Today</p>
            </div>
            <div className="flex flex-col items-center justify-center w-2/5 card mr-5">
                <div className="flex w-full items-center justify-center h-3/4 relative">
                    <Image
                        src={icon}
                        alt="bed icon"
                        className="p-3 rounded-full bg-[#72af8572]"
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

export default InwardReferralsCard;

