// src/components/patients/PatientRow.tsx

"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Patient, Session } from "@/lib/definitions";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

type PatientRowProps = {
    patient: Patient;
    session: Session | null;
    onEdit: (patientId: number) => void;
    onDelete: (patientId: number) => void;
};

const PatientRow: React.FC<PatientRowProps> = ({ patient, session, onEdit, onDelete }) => {
    // Format appointments based on the patient's last and next appointment logic
    const getLastAppointment = (appointments: Patient["appointments"] | undefined) => {
        if (!appointments || appointments.length === 0) return null;
        const pastAppointments = appointments.filter((appt) => new Date(appt.appointmentDate) < new Date());
        return pastAppointments.length > 0
            ? pastAppointments.reduce((latest, appt) =>
                  new Date(appt.appointmentDate) > new Date(latest.appointmentDate) ? appt : latest
              )
            : null;
    };

    const getNextAppointment = (appointments: Patient["appointments"] | undefined) => {
        if (!appointments || appointments.length === 0) return null;
        const futureAppointments = appointments.filter((appt) => new Date(appt.appointmentDate) > new Date());
        return futureAppointments.length > 0
            ? futureAppointments.reduce((earliest, appt) =>
                  new Date(appt.appointmentDate) < new Date(earliest.appointmentDate) ? appt : earliest
              )
            : null;
    };

    const lastAppt = getLastAppointment(patient.appointments);
    const nextAppt = getNextAppointment(patient.appointments);

    return (
        <tr className="bg-white shadow-md py-2">
            {/* Checkbox Column */}
            <td className="text-center w-[8%] p-2 rounded-l-[10px]">
                <input type="checkbox" className="w-[15px] h-[15px]" />
            </td>

            {/* Basic Info Column - Links to patient profile */}
            <td className="w-[25%] p-2">
                {/* <Link href={`/dashboard/patients/patient-profile/${patient.patientId}`}> */}
                    <div className="flex items-center gap-4">
                        <Image
                            alt="profile pic"
                            src="/images/img-p4.png"
                            width="50"
                            height="50"
                            className="rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <p className="font-semibold capitalize">{patient.name}</p>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <p className="text-sm text-primary truncate max-w-52 sm:max-w-[250px]">
                                            {patient.email.length > 13 ? `${patient.email.slice(0, 13)}...` : patient.email}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{patient.email}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                {/* </Link> */}
            </td>

            {/* Phone Number Column */}
            <td className="text-center w-[15%] p-2 whitespace-nowrap">{patient.phoneNo}</td>

            {/* Registration Number Column */}
            <td className="text-center w-[10%] p-2">{patient.patientId}</td>

            {/* Last Appointment Column */}
            <td className="text-center w-[15%] p-2">
                {lastAppt ? (
                    <>
                        <p>{new Date(lastAppt.appointmentDate).toLocaleDateString()}</p>
                        <p>{new Date(lastAppt.appointmentDate).toLocaleTimeString()}</p>
                    </>
                ) : (
                    <p>No recent appointment</p>
                )}
            </td>

            {/* Next Appointment Column */}
            <td className="text-center w-[15%] p-2">
                {nextAppt ? (
                    <>
                        <p>{new Date(nextAppt.appointmentDate).toLocaleDateString()}</p>
                        <p>{new Date(nextAppt.appointmentDate).toLocaleTimeString()}</p>
                    </>
                ) : (
                    <p>No upcoming appointment</p>
                )}
            </td>

            {/* Reason for Consultation Column */}
            <td className="text-center w-[15%] p-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <p className="truncate max-w-[150px]">
                                {patient.reasonForConsultation.length > 5
                                    ? `${patient.reasonForConsultation.slice(0, 5)}...`
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
                        <DropdownMenuItem onClick={() => onEdit(patient.patientId)} className="rounded-[5px]">
                            <DriveFileRenameOutlineIcon className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(patient.patientId)} className="rounded-[5px]">
                            <DeleteOutlineIcon className="mr-2" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </td>
        </tr>
    );
};

export default PatientRow;