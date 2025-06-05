// src/components/hospitals/ui/hospital-sidebar/HospitalSidebar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Hospital } from "@/lib/definitions";
import { useState } from "react";
// import hospitalPlaceholder from "@/public/images/logo.png";
import { EditHospitalDialog } from "./EditHospitalDialog";
import { AddDepartmentDialog } from "./AddDepartmentDialog";
import { useSession } from "next-auth/react";
import { Role } from "@/lib/definitions";

export default function HospitalSidebar({ hospital }: { hospital: Hospital }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);
    const { data: session } = useSession();
    const userRole = session?.user?.role as Role;

    const placeholderSrc = "/images/logo.png";

    return (
        <div className="bg-white shadow-md rounded-[10px] p-4 w-[300px]">
            {/* Header: Logo + Name / Basic */}
            <div className="flex items-center bg-black/5 py-2 px-1 rounded-[10px]">
                <div className="w-full p-2">
                    <img
                        src={hospital.logoUrl || placeholderSrc}
                        alt={`${hospital.hospitalName} logo`}
                        width={100}
                        height={100}
                        className="p-1 border-2 rounded-[10px]"
                    />
                </div>
            </div>

            {/* Basic Details Section */}
            <div className="mt-4">
                <h3 className="p-2 font-semibold text-base text-primary bg-bluelight/10 rounded-[10px]">
                    General Info
                </h3>
                <div className="mt-2 space-y-2 p-2">
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Facility Type:</strong>{" "}
                        {hospital.facilityType || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>NHIF Accreditation:</strong>{" "}
                        {hospital.nhifAccreditation || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Open 24 Hours:</strong>{" "}
                        {hospital.open24Hours || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Open Weekends:</strong>{" "}
                        {hospital.openWeekends || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Operating Hours:</strong>{" "}
                        {hospital.operatingHours || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Is Regulated?:</strong>{" "}
                        {hospital.regulated || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Regulation Status:</strong>{" "}
                        {hospital.regulationStatus || "N/A"}
                    </p>
                    <p className="text-[13px] flex gap-2 justify-between overflow-hidden bg-white rounded-[5px]">
                        <strong>Regulating Body:</strong>{" "}
                        <span className="text-[13px]">
                            {hospital.regulatingBody || "N/A"}
                        </span>
                    </p>
                    <p className="text-[13px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <span className="font-semibold">Website:</span>
                        {hospital.hospitalLink ? (
                            <a
                                href={hospital.hospitalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline max-w-[200px] truncate inline-block text-right"
                            >
                                Click Here
                            </a>
                        ) : (
                            <span>N/A</span>
                        )}
                    </p>
                </div>
            </div>

            {/* Contact Information */}
            <div className="mt-4">
                <h3 className="flex justify-between items-center p-2 font-semibold text-base text-primary bg-bluelight/10 rounded-[10px]">
                    <span>Contact Information</span>
                    {userRole === Role.SUPER_ADMIN && (
                        <Button
                            size="sm"
                            className="rounded-[10px] bg-white text-black hover:text-white hover:bg-primary"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Edit
                        </Button>
                    )}
                </h3>
            </div>

            {/* Administration Counts */}
            <div className="mt-4">
                <h3 className="flex justify-between items-center p-2 font-semibold text-base text-primary bg-bluelight/10 rounded-[10px]">
                    <span>Administration</span>
                    {userRole === Role.SUPER_ADMIN && (
                        <Button
                            size="sm"
                            className="rounded-[10px] bg-white text-black hover:text-white hover:bg-primary"
                            onClick={() => setIsAddDeptOpen(true)}
                        >
                            Add Dept
                        </Button>
                    )}
                </h3>
                <div className="mt-2 space-y-2 p-2">
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Referral Code:</strong>{" "}
                        {hospital.referralCode || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Registration #:</strong>{" "}
                        {hospital.registrationNumber || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>License #:</strong>{" "}
                        {hospital.licenseNumber || "N/A"}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Admin Count:</strong>{" "}
                        {hospital.admins?.length || 0}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Doctor Count:</strong>{" "}
                        {hospital.doctors?.length || 0}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Nurse Count:</strong>{" "}
                        {hospital.nurses?.length || 0}
                    </p>
                    <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-white rounded-[5px]">
                        <strong>Department Count:</strong>{" "}
                        {hospital.departments?.length || 0}
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-col space-y-4">
                <button className="bg-bluelight shadow-sm shadow-gray-400 px-4 py-2 text-black text-xs font-semibold rounded-[10px] hover:bg-primary hover:border-primary hover:text-white">
                    View All Doctors
                </button>
                <button className="bg-bluelight shadow-sm shadow-gray-400 px-4 py-2 text-black text-xs font-semibold rounded-[10px] hover:bg-primary hover:border-primary hover:text-white">
                    View All Admins
                </button>
            </div>

            {/* Modals: Edit Hospital / Add Department */}
            <EditHospitalDialog
                hospital={hospital}
                open={isEditOpen}
                onOpen={() => setIsEditOpen(true)}
                onClose={() => setIsEditOpen(false)}
            />

            <AddDepartmentDialog
                hospitalId={hospital.hospitalId}
                open={isAddDeptOpen}
                onOpen={() => setIsAddDeptOpen(true)}
                onClose={() => setIsAddDeptOpen(false)}
            />
        </div>
    );
}
