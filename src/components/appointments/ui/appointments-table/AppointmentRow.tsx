// src/components/appointments/ui/appointments-table/AppointmentRow.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Appointment } from "@/lib/definitions";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { differenceInYears } from "date-fns";
import { MapPin as PlaceIcon, Video } from "lucide-react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface AppointmentRowProps {
    appointment: Appointment;
    typeText: { [key: string]: string };
    actionText: { [key: string]: string };
    handleUpdateAppointmentType: (appointmentId: string, type: string) => void;
    handleDialogOpen: (type: string, appointmentId: string) => void;
    handleUpdateStatus: (appointmentId: string, status: string) => void;
    handleActionChange: (appointmentId: string, action: string) => void;
}

const AppointmentRow: React.FC<AppointmentRowProps> = ({
    appointment,
    typeText,
    actionText,
    handleUpdateAppointmentType,
    handleDialogOpen,
    handleUpdateStatus,
    handleActionChange,
}) => {
    const router = useRouter();

    const { appointmentId, patient, doctor, type, appointmentDate, status } =
        appointment;

    // Efficiently determine if the appointment is cancelled
    const isCancelled =
        status === "CANCELLED" || actionText[appointmentId] === "CANCELLED";
    const rowClass = isCancelled
        ? "bg-destructive/20 text-destructive-foreground"
        : "bg-background";

    // Safely retrieve patient's name from the related Profile entity
    const patientName = React.useMemo(() => {
        return patient?.user?.profile
            ? `${patient.user.profile.firstName} ${patient.user.profile.lastName}`
            : "N/A";
    }, [patient?.user?.profile]);

    // Compute patient's age using dateOfBirth from the Profile entity
    const patientAge = React.useMemo(() => {
        if (!patient?.user?.profile?.dateOfBirth) return "N/A";
        try {
            const birthDate = new Date(patient.user.profile.dateOfBirth);
            return differenceInYears(new Date(), birthDate);
        } catch (error) {
            console.error(
                "Invalid date of birth:",
                patient.user.profile.dateOfBirth
            );
            return "N/A";
        }
    }, [patient?.user?.profile?.dateOfBirth]);

    // Format date and time efficiently
    const formattedDate = React.useMemo(() => {
        return new Date(appointmentDate).toLocaleDateString();
    }, [appointmentDate]);

    const formattedTime = React.useMemo(() => {
        return new Date(appointmentDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }, [appointmentDate]);

    // navigate, on row click
    const onRowClick = () => {
        router.push(`/dashboard/appointments/${appointmentId}`);
    };

    return (
        <tr
            className={`group text-center cursor-pointer ${rowClass} shadow-md py-2 hover:bg-primary text-foreground hover:text-primary-foreground`}
            onClick={onRowClick}
        >
            {/* Patient Name */}
            <td className="p-2 whitespace-nowrap text-sm font-semibold text-left">
                {patientName}
            </td>

            {/* Patient Age */}
            <td className="p-2 whitespace-nowrap text-sm">
                {patientAge}
            </td>

            {/* Patient ID */}
            <td className="p-2 whitespace-nowrap text-sm">
                {patient?.patientId || "N/A"}
            </td>

            {/* Appointment Time */}
            <td className="p-2 whitespace-nowrap text-sm">
                {formattedTime}
            </td>

            {/* Appointment Date */}
            <td className="p-2 whitespace-nowrap text-sm">
                {formattedDate}
            </td>

            {/* Doctor's Name */}
            <td className="p-2 whitespace-nowrap text-sm">
                {doctor?.user?.profile
                    ? `Dr. ${doctor.user.profile.firstName} ${doctor.user.profile.lastName}`
                    : "N/A"}
            </td>

            {/* Appointment Type Dropdown */}
            <td className="p-2 whitespace-nowrap text-sm">
                <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex w-auto justify-center p-1 border rounded-[5px] max-w-[120px] bg-background-muted text-foreground">
                            <span className="flex gap-1 items-center">
                                {typeText[appointmentId] === "Virtual" ? (
                                    <Video className="text-primary" />
                                ) : (
                                    <PlaceIcon className="text-foreground/70" />
                                )}
                                <span>{typeText[appointmentId]}</span>
                                <ArrowDropDownIcon className="ml-1 text-muted-foreground" />
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
                                <Video className="text-foreground/70 mr-2" />
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
                                <PlaceIcon className="text-foreground/70 mr-2" />
                                Walk In
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>

            {/* Action Dropdown */}
            <td className="p-2 whitespace-nowrap text-sm">
                <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex w-auto justify-center p-1 border rounded max-w-[120px] bg-background-muted text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                            <span className="flex gap-1">
                                <span className="pl-2">
                                    {actionText[appointmentId]
                                        ? `${actionText[appointmentId]
                                              .charAt(0)
                                              .toUpperCase()}${actionText[
                                              appointmentId
                                          ]
                                              .slice(1)
                                              .toLowerCase()}`
                                        : status
                                        ? `${status
                                              .charAt(0)
                                              .toUpperCase()}${status
                                              .slice(1)
                                              .toLowerCase()}`
                                        : "Action"}
                                </span>
                                <ArrowDropDownIcon />
                            </span>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="rounded-[10px] shadow-md p-2">
                            <DropdownMenuItem
                                onSelect={() => {
                                    handleActionChange(
                                        appointmentId,
                                        "Rescheduled"
                                    );
                                    handleDialogOpen(
                                        "Reschedule",
                                        appointmentId
                                    );
                                }}
                                className="p-2 rounded-[5px]"
                            >
                                Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => {
                                    handleActionChange(
                                        appointmentId,
                                        "Cancelled"
                                    );
                                    handleDialogOpen("Cancel", appointmentId);
                                }}
                                className="p-2 rounded-[5px]"
                            >
                                Cancel
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => {
                                    handleActionChange(
                                        appointmentId,
                                        "Pending"
                                    );
                                    handleDialogOpen("Pending", appointmentId);
                                }}
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

const propsAreEqual = (
    prevProps: AppointmentRowProps,
    nextProps: AppointmentRowProps
) => {
    return (
        prevProps.appointment === nextProps.appointment &&
        prevProps.typeText[nextProps.appointment.appointmentId] ===
            nextProps.typeText[nextProps.appointment.appointmentId] &&
        prevProps.actionText[nextProps.appointment.appointmentId] ===
            nextProps.actionText[nextProps.appointment.appointmentId] &&
        prevProps.handleUpdateAppointmentType ===
            nextProps.handleUpdateAppointmentType &&
        prevProps.handleDialogOpen === nextProps.handleDialogOpen &&
        prevProps.handleUpdateStatus === nextProps.handleUpdateStatus &&
        prevProps.handleActionChange === nextProps.handleActionChange
    );
};

export default React.memo(AppointmentRow, propsAreEqual);
