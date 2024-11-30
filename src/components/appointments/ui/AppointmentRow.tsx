// src/components/appointments/AppointmentRow.tsx

"use client";

import React from "react";
import { Appointment } from "@/lib/definitions";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { differenceInYears } from "date-fns";
import { MapPin as PlaceIcon, Video } from 'lucide-react';
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface AppointmentRowProps {
    appointment: Appointment;
    typeText: { [key: string]: string };
    actionText: { [key: string]: string };
    handleUpdateAppointmentType: (appointmentId: string, type: string) => void;
    handleDialogOpen: (type: string, appointmentId: string) => void;
    handleUpdateStatus: (appointmentId: string, status: string) => void;
}

const AppointmentRow: React.FC<AppointmentRowProps> = ({
    appointment,
    typeText,
    actionText,
    handleUpdateAppointmentType,
    handleDialogOpen,
    handleUpdateStatus,
}) => {
    const { appointmentId, patient, doctor, type, appointmentDate, status } =
        appointment;

    // Determine if appointment is cancelled
    const isCancelled = status === "Cancelled";
    const rowClass = isCancelled ? "bg-red-100" : "bg-white";

    // Compute age if dateOfBirth exists
    const age = patient.dateOfBirth
        ? differenceInYears(new Date(), new Date(patient.dateOfBirth))
        : "N/A";

    // Format date and time
    const formattedDate = new Date(appointmentDate).toLocaleDateString();
    const formattedTime = new Date(appointmentDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <tr className={`text-center ${rowClass}`}>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-left">
                {patient.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {age}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {patient.patientId}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {formattedTime}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {formattedDate}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {doctor.user.profile
                    ? `Dr. ${doctor.user.profile.firstName} ${doctor.user.profile.lastName}`
                    : "N/A"}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex w-auto justify-center p-1 border-gray-300 rounded-[5px] max-w-[120px] bg-gray-100 text-gray-700">
                            <span className="flex gap-1 items-center">
                                {typeText[appointmentId] === "Virtual" ? (
                                    <Video className="text-primary" />
                                ) : (
                                    <PlaceIcon className="text-black/70" />
                                )}
                                <span>{typeText[appointmentId]}</span>
                                <ArrowDropDownIcon className="ml-1 text-gray-500" />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-[10px] shadow-md p-2">
                            <DropdownMenuItem
                                onSelect={() =>
                                    handleUpdateAppointmentType(
                                        appointmentId,
                                        "Virtual"
                                    )
                                }
                                className="p-2 rounded-[5px]"
                            >
                                <Video className="text-black/70 mr-2" />
                                Virtual
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() =>
                                    handleUpdateAppointmentType(
                                        appointmentId,
                                        "Walk In"
                                    )
                                }
                                className="p-2 rounded-[5px]"
                            >
                                <PlaceIcon className="text-black/70 mr-2" />
                                Walk In
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex w-auto justify-center p-1 border-gray-300 rounded max-w-[120px] bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary">
                            <span className="flex gap-1">
                                <span className="pl-2">
                                    {actionText[appointmentId] ||
                                        status ||
                                        "Action"}
                                </span>
                                <ArrowDropDownIcon />
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-[10px] shadow-md p-2">
                            <DropdownMenuItem
                                onSelect={() =>
                                    handleDialogOpen(
                                        "Reschedule",
                                        appointmentId
                                    )
                                }
                                className="p-2 rounded-[5px]"
                            >
                                Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() =>
                                    handleDialogOpen("Cancel", appointmentId)
                                }
                                className="p-2 rounded-[5px]"
                            >
                                Cancel
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() =>
                                    handleDialogOpen("Pending", appointmentId)
                                }
                                className="p-2 rounded-[5px]"
                            >
                                Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() =>
                                    handleUpdateStatus(
                                        appointmentId,
                                        "Confirmed"
                                    )
                                }
                                className="p-2 rounded-[5px]"
                            >
                                Confirm
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() =>
                                    handleUpdateStatus(
                                        appointmentId,
                                        "Completed"
                                    )
                                }
                                className="p-2 rounded-[5px]"
                            >
                                Completed
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    );
};

export default AppointmentRow;
