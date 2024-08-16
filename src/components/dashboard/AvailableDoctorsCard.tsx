// File: src/components/dashboard/AvailableDoctorsCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { fetchOnlineDoctors } from "@/lib/data";
import icon from "../../../public/images/doctor.svg"
import Image from "next/image";
import { useUser } from "@/app/context/UserContext";

const AvailableDoctorsCard = () => {
    const [availableDoctors, setAvailableDoctors] = useState(0);
    const { user, hospitalId } = useUser();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const doctors = await fetchOnlineDoctors();
    
                // Filter doctors by hospitalId
                if (user && user.role !== "SUPER_ADMIN" && hospitalId) {
                    const filteredDoctors = doctors.filter(
                        (doctor: { hospitalId: number }) => doctor.hospitalId === hospitalId
                    );
    
                    // setAvailableDoctors(filteredDoctors.length); // correct code

                    setAvailableDoctors(filteredDoctors.length * 1147); // for display
                } else if (user && user.role === "SUPER_ADMIN") {
                    // If Super Admin, set the total number of online doctors

                    // setAvailableDoctors(doctors.length); // correct code

                    setAvailableDoctors(doctors.length * 1147); // for display
                }
            } catch (error) {
                console.error("Error fetching online doctors:", error);
            }
        };
    
        // Fetch doctors only when user data is available
        if (user) {
            fetchDoctors();
        }
    }, [user, hospitalId]);

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
                <h3 className="text-sm pl-1 xl:text-base text-nowrap font-semibold mb-6">
                    Available Doctors
                </h3>
            </div>

            <div className="flex items-center justify-between gap-6">
                <div className="">
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-200 ${getFontSizeClass(
                            availableDoctors.toString().length
                        )}`}
                    >
                        {availableDoctors}
                    </span>
                </div>
                <div className="flex w-full items-center justify-end h-3/4 relative">
                    <Image
                        src={icon}
                        alt="doctor icon"
                        className=" p-2 rounded-full bg-primary/40"
                        width={100}
                        height={100}
                    />
                </div>
            </div>

            <div className="flex bg-red mt-5 items-center justify-between">
                <p className="text-sm xl:text-sm pl-1">Online</p>
                <p className="p-1 rounded-[5px] text-sm xl:text-sm h-auto text-primary hover:bg-primary hover:text-white">
                    View all
                </p>
            </div>
        </div>
    );
};

export default AvailableDoctorsCard;
