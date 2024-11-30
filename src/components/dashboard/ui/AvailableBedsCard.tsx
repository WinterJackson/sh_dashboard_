// File: src/components/dashboard/ui/AvailableBedsCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { fetchAvailableBeds } from "@/lib/data";
import icon from "../../../../public/images/bed.svg";
import Image from "next/image";

interface AvailableBedsCardProps {
    session: {
        user: {
            role: string;
            hospitalId: number | null;
        };
    };
}

const AvailableBedsCard: React.FC<AvailableBedsCardProps> = ({ session }) => {
    const [availableBeds, setAvailableBeds] = useState(0);

    useEffect(() => {
        const fetchBeds = async () => {
            const beds = await fetchAvailableBeds();

            // Filter beds based on user role and hospitalId
            const filteredBeds =
                session.user.role === "SUPER_ADMIN"
                    ? beds
                    : beds.filter(
                          (bed: { hospitalId: number }) =>
                              bed.hospitalId === session.user.hospitalId
                      );

            setAvailableBeds(filteredBeds.length);
        };

        fetchBeds();
    }, [session]);

    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 3) return "text-4xl xl:text-6xl";
        if (numDigits <= 4) return "text-3xl xl:text-6xl";
        if (numDigits <= 5) return "text-2xl xl:text-5xl";
        if (numDigits <= 6) return "text-xl xl:text-5xl";
        if (numDigits <= 7) return "text-l xl:text-5xl";
        return "text-base";
    };

    return (
        <div className="grid p-4 rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <div className="flex">
                <h3 className="text-sm xl:text-base text-nowrap font-semibold mb-6">
                    Available Beds
                </h3>
            </div>

            <div className="flex items-center justify-between gap-6">
                <div>
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
