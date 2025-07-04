// src/components/hospitals/ui/hospital-sidebar/HospitalSidebar.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Hospital, Role } from "@/lib/definitions";
import { useState } from "react";
import { EditHospitalDialog } from "./EditHospitalDialog";
import { AddDepartmentDialog } from "./AddDepartmentDialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface HospitalSidebarProps {
    hospital: Hospital;
    userRole: Role;
}

export default function HospitalSidebar({
    hospital,
    userRole,
}: HospitalSidebarProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isAddDeptOpen, setIsAddDeptOpen] = useState(false);

    const placeholderSrc = "/images/logo.png";

    return (
        <div className="bg-card shadow-md shadow-shadow-main rounded-[10px] w-[300px]">
            {/* Header: Logo + Name / Basic */}
            <div className="flex items-center bg-accent py-2 px-1 rounded-t-[10px] h-[90px]">
                <div className="w-full p-2">
                    <img
                        src={hospital.logoUrl || placeholderSrc}
                        alt={`${hospital.hospitalName} logo`}
                        width={100}
                        height={100}
                        className="p-1 border-0 rounded-[10px]"
                    />
                </div>
            </div>

            <div className="p-4">
                {/* Basic Details Section */}
                <div className="mt-6">
                    <h3 className="p-2 mb-6 font-semibold text-base text-primary bg-accent rounded-[10px]">
                        General Info
                    </h3>
                    <div className="mt-2 space-y-2">
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Facility Type:</strong>{" "}
                            {hospital.facilityType || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>NHIF Accreditation:</strong>{" "}
                            {hospital.nhifAccreditation || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Open 24 Hours:</strong>{" "}
                            {hospital.open24Hours || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Open Weekends:</strong>{" "}
                            {hospital.openWeekends || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Operating Hours:</strong>{" "}
                            {hospital.operatingHours || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Is Regulated?:</strong>{" "}
                            {hospital.regulated || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Regulation Status:</strong>{" "}
                            {hospital.regulationStatus || "N/A"}
                        </p>
                        <p className="text-[13px] flex gap-2 justify-between overflow-hidden bg-slate rounded-[5px] p-2">
                            <div className="flex items-center gap-1">
                                <strong>Regulating Body:</strong>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="cursor-pointer">
                                                <Info size={14} />
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                The entity that performs the act
                                                of regulating or supervising a
                                                healthcare institution or
                                                activity.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <span className="text-[13px]">
                                {hospital.regulatingBody || "N/A"}
                            </span>
                        </p>

                        <p className="text-[13px] flex gap-2 justify-between overflow-hidden bg-slate rounded-[5px] p-2">
                            <div className="flex items-center gap-1">
                                <strong>Regulatory Body:</strong>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="cursor-pointer">
                                                <Info size={14} />
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                The official authority or
                                                organization that enforces rules
                                                or standards in the healthcare
                                                sector.
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <span className="text-[13px]">
                                {hospital.regulatoryBody || "N/A"}
                            </span>
                        </p>

                        <p className="text-[13px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
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
                <div className="mt-6">
                    <h3 className="flex justify-between items-center p-2 font-semibold text-base text-primary bg-accent rounded-[10px]">
                        <span>Contact Information</span>
                        {userRole === Role.SUPER_ADMIN && (
                            <Button
                                size="sm"
                                className="rounded-[10px] bg-background text-foreground hover:text-primary-foreground hover:bg-primary"
                                onClick={() => setIsEditOpen(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </h3>
                </div>

                {/* Administration Counts */}
                <div className="mt-4">
                    <h3 className="flex justify-between items-center p-2 mb-6 font-semibold text-base text-primary bg-accent rounded-[10px]">
                        <span>Administration</span>
                        {userRole === Role.SUPER_ADMIN && (
                            <Button
                                size="sm"
                                className="rounded-[10px] bg-background text-foreground hover:text-primary-foreground hover:bg-primary"
                                onClick={() => setIsAddDeptOpen(true)}
                            >
                                Add Dept
                            </Button>
                        )}
                    </h3>
                    <div className="mt-2 space-y-2">
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Referral Code:</strong>{" "}
                            {hospital.referralCode || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Registration #:</strong>{" "}
                            {hospital.registrationNumber || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>License #:</strong>{" "}
                            {hospital.licenseNumber || "N/A"}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Admin Count:</strong>{" "}
                            {hospital.admins?.length || 0}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Doctor Count:</strong>{" "}
                            {hospital.doctors?.length || 0}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Nurse Count:</strong>{" "}
                            {hospital.nurses?.length || 0}
                        </p>
                        <p className="text-[15px] flex gap-2 justify-between whitespace-nowrap bg-slate rounded-[5px] p-2">
                            <strong>Department Count:</strong>{" "}
                            {hospital.departments?.length || 0}
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 flex flex-col space-y-4">
                    <button className="bg-accent shadow-sm shadow-shadow-main px-4 py-2 text-foreground text-xs font-semibold rounded-[10px] hover:bg-primary hover:border-primary hover:text-primary-foreground">
                        View All Doctors
                    </button>
                    <button className="bg-accent shadow-sm shadow-shadow-main px-4 py-2 text-foreground text-xs font-semibold rounded-[10px] hover:bg-primary hover:border-primary hover:text-primary-foreground">
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
        </div>
    );
}
