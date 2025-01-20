// File: src/components/dashboard/ui/TopDoctorsCard.tsx

"use client";

import { Rating } from "@mui/material";
import Image from "next/image";
import React from "react";

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
        <div className="p-6 h-[510px] flex flex-col gap-4 shadow-lg shadow-gray-300 rounded-[20px] bg-slate-100 w-full mb-8">
            <h1 className="text-base font-semibold capitalize whitespace-nowrap">
                Top Doctors
            </h1>
            <div className="flex flex-col h-[550px] gap-5 w-full overflow-x-auto whitespace-nowrap py-3">
                {topDoctors?.length === 0 ? (
                    <p className="text-gray-500">No top doctors found.</p>
                ) : (
                    topDoctors.map((doctor) => (
                        <div key={doctor.doctorId} className="flex gap-3">
                            <Image
                                src={doctor.imageUrl}
                                alt={doctor.name}
                                width={55}
                                height={55}
                                className="object-cover rounded-full border-4 border-gray-300"
                            />
                            <div className="flex w-full items-center justify-between gap-4 border-gray-300">
                                <div className="flex-shrink-0 flex flex-col gap-1 min-w-[400px]">
                                    <h1 className="font-semibold text-base capitalize whitespace-nowrap px-1 rounded-[5px]">
                                        {doctor.name}
                                    </h1>
                                    <p className="text-accent capitalize whitespace-nowrap px-1">
                                        {doctor.specialization}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 flex flex-col gap-2 items-end min-w-[100px]">
                                    <Rating
                                        value={doctor.rating}
                                        precision={0.1}
                                        readOnly
                                    />
                                    <p className="whitespace-nowrap">
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
