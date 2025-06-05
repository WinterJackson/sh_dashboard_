// src/components/patients/ui/patient-table/PatientRow.tsx

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Patient } from "@/lib/definitions";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useRouter } from "next/navigation";

type PatientRowProps = {
    patient: Patient;
    onDelete: (patientId: number) => void;
    onSelect: (patientId: number, checked: boolean) => void;
    isSelected: boolean;
};

const PatientRow: React.FC<PatientRowProps> = ({
    patient,
    onDelete,
    onSelect,
    isSelected,
}) => {
    const profile = patient.user?.profile;
    const user = patient.user;
    const router = useRouter();

    // Format appointments based on the patient's last and next appointment logic
    const getLastAppointment = (
        appointments: Patient["appointments"] | undefined
    ) => {
        if (!appointments || appointments.length === 0) return null;
        const pastAppointments = appointments.filter(
            (appt) => new Date(appt.appointmentDate) < new Date()
        );
        return pastAppointments.length > 0
            ? pastAppointments.reduce((latest, appt) =>
                  new Date(appt.appointmentDate) >
                  new Date(latest.appointmentDate)
                      ? appt
                      : latest
              )
            : null;
    };

    const getNextAppointment = (
        appointments: Patient["appointments"] | undefined
    ) => {
        if (!appointments || appointments.length === 0) return null;
        const futureAppointments = appointments.filter(
            (appt) => new Date(appt.appointmentDate) > new Date()
        );
        return futureAppointments.length > 0
            ? futureAppointments.reduce((earliest, appt) =>
                  new Date(appt.appointmentDate) <
                  new Date(earliest.appointmentDate)
                      ? appt
                      : earliest
              )
            : null;
    };

    const lastAppt = getLastAppointment(patient.appointments);
    const nextAppt = getNextAppointment(patient.appointments);

    const handleEdit = () => {
        router.push(`/dashboard/patients/${patient.patientId}`);
    };

    return (
        <tr className="bg-white shadow-md py-2 hover:bg-gray-100">
            {/* Checkbox Column */}
            <td className="text-center w-[8%] p-2 rounded-l-[10px]">
                <input
                    type="checkbox"
                    className="w-[15px] h-[15px]"
                    checked={isSelected}
                    onChange={(e) =>
                        onSelect(patient.patientId, e.target.checked)
                    }
                />
            </td>

            {/* Basic Info Column - Links to patient profile */}
            <td className="w-[25%] p-2">
                <Link href={`/dashboard/patients/${patient.patientId}`}>
                    {" "}
                    <div className="flex items-center gap-4">
                        <Image
                            alt="Profile picture"
                            src="/images/img-p4.png"
                            // src={profile?.imageUrl || "/images/default-avatar.png"}
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    "/images/default-avatar.png";
                            }}
                        />
                        <div className="flex flex-col">
                            <p className="font-semibold text-[14px] whitespace-nowrap capitalize">
                                {profile?.firstName} {profile?.lastName}
                            </p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <p className="text-sm text-primary truncate max-w-52 sm:max-w-[250px]">
                                            {user?.email?.length > 13
                                                ? `${user?.email?.slice(
                                                      0,
                                                      13
                                                  )}...`
                                                : user?.email}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{user?.email}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </Link>
            </td>

            {/* Phone Number Column */}
            <td className="text-center w-[15%] p-2 whitespace-nowrap">
                {profile?.phoneNo || "N/A"}
            </td>

            {/* Registration Number Column */}
            <td className="text-center w-[10%] p-2">{patient.patientId}</td>

            {/* Last Appointment Column */}
            <td className="text-center w-[15%] p-2">
                {lastAppt ? (
                    <>
                        <p className="text-[13px]">
                            {new Date(
                                lastAppt.appointmentDate
                            ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                        <p className="text-[13px]">
                            {new Date(
                                lastAppt.appointmentDate
                            ).toLocaleTimeString()}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-400 text-[13px]">No recent appointment</p>
                )}
            </td>

            {/* Next Appointment Column */}
            <td className="text-center w-[15%] p-2">
                {nextAppt ? (
                    <>
                        <p className="text-[13px]">
                        {new Date(
                                nextAppt.appointmentDate
                            ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                        <p className="text-[13px]">
                            {new Date(
                                nextAppt.appointmentDate
                            ).toLocaleTimeString()}
                        </p>
                    </>
                ) : (
                    <p className="text-gray-400 text-[13px]">No upcoming appointment</p>
                )}
            </td>

            {/* Reason for Consultation Column */}
            <td className="text-center w-[15%] p-2 text-[13px]">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <p className="truncate max-w-[150px]">
                                {patient.reasonForConsultation.length > 5
                                    ? `${patient.reasonForConsultation.slice(
                                          0,
                                          5
                                      )}...`
                                    : patient.reasonForConsultation}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{patient.reasonForConsultation}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </td>

            {/* Action Column - Dropdown for Edit/Delete */}
            <td className="text-center p-2 rounded-r-[10px]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button>
                            <MoreHorizIcon className="cursor-pointer" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white rounded-xl shadow-md p-2 w-24 mr-9">
                        <DropdownMenuItem
                            onClick={handleEdit}
                            className="rounded-[5px]"
                        >
                            <DriveFileRenameOutlineIcon className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(patient.patientId)}
                            className="rounded-[5px]"
                        >
                            <DeleteOutlineIcon className="mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
};

export default PatientRow;
