// src/components/doctors/ui/DoctorsCard.tsx

"use client";

import React, { useState } from "react";
import DoctorBio from "./DoctorBio";
import Image from "next/image";
import { Rating } from "@mui/material";
import AddAppointmentDialog from "@/components/appointments/AddAppointmentDialog"; // Import the appointment dialog
import { Doctor } from "@/lib/definitions";

interface DoctorsCardProps {
    doctor: Doctor;
}

const DoctorsCard: React.FC<DoctorsCardProps> = ({ doctor }) => {
    const [showBio, setShowBio] = useState(false);
    const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);

    const handleOpenBio = () => {
        setShowBio(true);
    };

    const handleCloseBio = () => {
        setShowBio(false);
    };

    const handleAppointDoctorClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowAppointmentDialog(true);
    };

    return (
        <div className="flex-1 shadow-lg shadow-gray-300 rounded-xl min-w-auto max-w-[500px] lg:min-w-[400px] xl:w-[500px]">
            <div
                onClick={handleOpenBio}
                className="relative flex flex-col gap-2 justify-center rounded-xl p-4 cursor-pointer"
            >
                {/* Doctor Status */}
                <div className="flex justify-start">
                    <p
                        className={`text-sm font-semibold ${
                            doctor.status === "Online"
                                ? "text-green-500"
                                : "text-red-500"
                        }`}
                    >
                        {doctor.status === "Online" ? "Online" : "Offline"}
                    </p>
                </div>

                {/* Doctor Profile Info */}
                <div className="flex w-full gap-4">
                    <div className="w-1/2 flex justify-center items-center">
                        <Image
                            src={doctor.user?.profile?.imageUrl || "/images/doctor.svg"}
                            alt={`Profile picture of Dr. ${doctor.user?.profile?.firstName || "Doctor"} ${doctor.user?.profile?.lastName || ""}`}
                            width={80}
                            height={80}
                            className="rounded-[50%] border-4 border-gray-300"
                        />
                    </div>

                    {/* Line separator */}
                    <div className="w-[1px] bg-gray-300"></div>

                    <div className="flex flex-col w-1/2 gap-2">
                        <h1 className="text-l capitalize font-semibold">
                            {doctor.specialization?.name || "No specialization"}
                        </h1>
                        <p className="text-sm text-gray-700 capitalize">
                            Dept: {doctor.department.name}
                        </p>
                        <div className="flex justify-between items-center">
                            <Rating
                                value={doctor.averageRating}
                                precision={0.1}
                                readOnly
                            />
                            <p className="text-sm text-gray-500">
                                {doctor.averageRating.toFixed(1)} / 5
                            </p>
                        </div>
                    </div>
                </div>

                {/* Doctor Name and Appointment Button */}
                <div className="flex justify-between items-center mt-2 gap-2 w-full">
                    <div className="flex-1 w-1/2">
                        <h1 className="font-bold text-l">
                            Dr. {doctor.user?.profile?.firstName}{" "}
                            {doctor.user?.profile?.lastName}
                        </h1>
                    </div>

                    <div className="w-1/2 pl-4">
                        <button
                            className="p-2 border-2 border-primary text-primary hover:bg-blue-300 hover:text-black hover:border-blue-300 font-semibold rounded-xl whitespace-nowrap"
                            onClick={handleAppointDoctorClick}
                        >
                            Appoint Doctor
                        </button>
                    </div>
                </div>
            </div>

            {/* Doctor Bio Modal */}
            {showBio && (
                <div>
                    <div className="fixed inset-0 bg-black/80 z-40"></div>
                    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
                        <div className="bg-white p-4 shadow-md rounded-lg">
                            <DoctorBio cancel={handleCloseBio} />
                            <button
                                className="mt-2 p-2 border border-black"
                                onClick={handleCloseBio}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Appointment Dialog */}
            {showAppointmentDialog && (
                <AddAppointmentDialog
                    doctor={doctor}
                    onClose={() => setShowAppointmentDialog(false)}
                />
            )}
        </div>
    );
};

export default DoctorsCard;
