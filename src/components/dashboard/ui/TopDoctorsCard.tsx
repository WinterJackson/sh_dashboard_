// src/components/dashboard/ui/TopDoctorsCard.tsx

"use client";

import { Rating } from "@mui/material";
import Image from "next/image";
import React from "react";
import { Info } from "lucide-react";
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

interface TopDoctor {
    doctorId: number;
    imageUrl: string;
    name: string;
    rating: number;
    specialization: string;
}

interface TopDoctorsCardProps {
    topDoctors: TopDoctor[];
}

const TopDoctorsCard: React.FC<TopDoctorsCardProps> = ({ topDoctors = [] }) => {
    return (
        <div className="cursor-pointer p-6 h-[500px] flex flex-col gap-4 shadow-md shadow-shadow-main rounded-[20px] bg-card w-full mb-8">
            <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold capitalize whitespace-nowrap">
                    Top Doctors
                </h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info
                                size={16}
                                className="text-text-muted cursor-pointer"
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Displays a list of top-rated doctors based on
                                patient reviews.
                                <br />
                                <br />
                                Each entry shows the doctor's
                                name, specialization, average rating, and
                                profile image.
                                <br />
                                <br />
                                Use this to quickly identify
                                highly rated physicians.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex flex-col h-[550px] gap-0 w-full overflow-x-auto scrollbar-custom whitespace-nowrap py-2">
                {topDoctors?.length === 0 ? (
                    <p className="text-text-muted text-xs sm:text-sm">No top doctors found.</p>
                ) : (
                    topDoctors.map((doctor) => (
                        <div key={doctor.doctorId} className="flex gap-3 border-b border-t py-2">
                            <Image
                                src={doctor.imageUrl}
                                alt={doctor.name}
                                width={55}
                                height={55}
                                className="object-cover rounded-full border-4 border-border"
                            />
                            <div className="flex w-full items-center justify-between gap-4 border-border">
                                <div className="flex-shrink-0 flex flex-col gap-1 min-w-[400px]">
                                    <h1 className="font-semibold text-xs sm:text-sm md:text-base capitalize whitespace-nowrap px-1 rounded-[5px]">
                                        {doctor.name}
                                    </h1>
                                    <p className="text-text-muted text-xs sm:text-sm md:text-base capitalize whitespace-nowrap px-1">
                                        {doctor.specialization}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 flex flex-col gap-2 items-end min-w-[100px]">
                                    <Rating
                                        value={doctor.rating}
                                        precision={0.1}
                                        readOnly
                                    />
                                    <p className="whitespace-nowrap text-xs sm:text-sm md:text-base">
                                        {doctor.rating.toFixed(1)} / 5
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TopDoctorsCard;
