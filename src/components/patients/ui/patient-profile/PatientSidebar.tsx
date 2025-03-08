// src/components/patients/PatientSidebar.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import AddAppointmentDialog from "@/components/appointments/AddAppointmentDialog";
import { Patient } from "@/lib/definitions";
import { calculateAge } from "@/hooks/useCalculateAge";
import { formatDate } from "@/hooks/useFormatDate";
import pp from "../../../../../public/images/profile-placeholder.png";

export default function PatientSidebar({ patient }: { patient: Patient }) {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="bg-white shadow-md rounded-[10px] p-4 w-[300px]">
            <div className="flex items-center bg-black/5 py-2 px-1 rounded-[10px]">
                <div className="w-1/2 p-2">
                    <Image
                        src={patient.imageUrl || pp}
                        alt={`${patient.name}'s profile`}
                        width={100}
                        height={100}
                        className="rounded-full border-2"
                    />
                </div>
                <div className="flex flex-col gap-1 w-1/2 p-2">
                    <h2 className="text-base font-semibold">{patient.name}</h2>
                    <p className="text-gray-600 text-sm">
                        Reg: {patient.patientId}
                    </p>
                    <p className="text-gray-600 text-sm">{patient.gender}</p>
                    <p className="text-gray-600 text-sm">
                        {calculateAge(patient.dateOfBirth)} Years
                    </p>
                    <p className="text-gray-600 text-sm">
                        Date Joined: {formatDate(patient.createdAt)}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="p-2 font-semibold text-base text-primary bg-bluelight/10 rounded-[10px]">
                    Basic Information
                </h3>
                <div className="mt-2 space-y-2 p-2">
                    <p className="text-[15px]">
                        <strong>Marital Status:</strong>{" "}
                        {patient.maritalStatus || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Occupation:</strong>{" "}
                        {patient.occupation || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Home Address:</strong>{" "}
                        {patient.homeAddress || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Phone:</strong> {patient.phoneNo}
                    </p>
                    <p className="text-[15px]">
                        <strong>Email:</strong> {patient.email}
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="p-2 font-semibold text-base text-primary bg-bluelight/10 rounded-[10px]">
                    Next Of Kin Information
                </h3>
                <div className="mt-2 space-y-2 p-2">
                    <p className="text-[15px]">
                        <strong>Name:</strong> {patient.nextOfKinName || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Relationship:</strong>{" "}
                        {patient.nextOfKinRelationship || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Home Address:</strong>{" "}
                        {patient.nextOfKinHomeAddress || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Phone:</strong>{" "}
                        {patient.nextOfKinPhoneNo || "N/A"}
                    </p>
                    <p className="text-[15px]">
                        <strong>Email:</strong>{" "}
                        {patient.nextOfKinEmail || "N/A"}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex flex-col space-y-4">
            <button 
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-bluelight shadow-sm shadow-gray-400 px-4 py-2 text-black text-xs font-semibold rounded-[10px] hover:bg-primary hover:border-primary hover:text-white"
                >
                    Add Appointment +
                </button>
                
                <AddAppointmentDialog 
                    open={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    patient={patient}
                />

                <button className="bg-bluelight shadow-sm shadow-gray-400 px-4 py-2 text-black text-xs font-semibold rounded-[10px] hover:bg-primary hover:border-primary hover:text-white">
                    Send Message
                </button>
            </div>
        </div>
    );
}
