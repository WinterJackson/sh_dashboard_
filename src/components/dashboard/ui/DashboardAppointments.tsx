// src/components/dashboard/ui/DashboardAppointments.tsx

"use client";

import AppointmentsPagination from "@/components/appointments/ui/appointments-table/AppointmentsPagination";
import { Appointment } from "@/lib/definitions";
import { differenceInYears } from "date-fns";
import { MapPin as PlaceIcon, Video, Info } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";

interface DashboardAppointmentsProps {
    appointments: Appointment[];
    totalAppointments: number;
}

const ITEMS_PER_PAGE = 15;

const DashboardAppointments: React.FC<DashboardAppointmentsProps> = ({
    appointments,
    totalAppointments,
}) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const router = useRouter();

    const totalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const currentAppointments = appointments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderTableRows = () =>
        currentAppointments.map((appointment) => {
            const isCancelled = appointment.status === "CANCELLED";
            const rowClass = isCancelled ? "bg-destructive/20" : "bg-card";

            const onRowClick = () => {
                router.push(
                    `/dashboard/appointments/${appointment.appointmentId}`
                );
            };

            return (
                <tr
                    key={appointment.appointmentId}
                    className={`text-center cursor-pointer ${rowClass} hover:bg-primary active:bg-light-accent group`}
                    onClick={onRowClick}
                >
                    <td className="px-4 py-4 text-sm font-semibold text-text-main group-hover:text-primary-foreground hover:text-primary-foreground text-left whitespace-nowrap">
                        {appointment.patient?.user?.profile?.firstName &&
                        appointment.patient?.user?.profile?.lastName
                            ? `${appointment.patient.user.profile.firstName} ${appointment.patient.user.profile.lastName}`
                            : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted group-hover:text-primary-foreground whitespace-nowrap">
                        {appointment.patient?.user?.profile?.dateOfBirth
                            ? differenceInYears(
                                  new Date(),
                                  new Date(
                                      appointment.patient.user.profile.dateOfBirth
                                  )
                              )
                            : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted group-hover:text-primary-foreground whitespace-nowrap">
                        {appointment.patient?.patientId || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-muted group-hover:text-primary-foreground whitespace-nowrap">
                        {new Date(
                            appointment.appointmentDate
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-muted group-hover:text-primary-foreground whitespace-nowrap">
                        {new Date(
                            appointment.appointmentDate
                        ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-muted group-hover:text-primary-foreground whitespace-nowrap">
                        {appointment.doctor?.user?.profile
                            ? `Dr. ${appointment.doctor.user.profile.firstName} ${appointment.doctor.user.profile.lastName}`
                            : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm flex items-center justify-center gap-2 whitespace-nowrap">
                        {appointment.type === "Virtual" ? (
                            <>
                                <Video className="text-primary group-hover:text-primary-foreground" />
                                <span className="text-primary group-hover:text-primary-foreground">
                                    {appointment.type}
                                </span>
                            </>
                        ) : (
                            <>
                                <PlaceIcon className="text-text-muted group-hover:text-primary-foreground" />
                                <span className="text-text-muted group-hover:text-primary-foreground">
                                    {appointment.type}
                                </span>
                            </>
                        )}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-muted group-hover:text-primary-foreground whitespace-nowrap">
                        {appointment.status}
                    </td>
                </tr>
            );
        });

    return (
<div className="flex flex-col cursor-pointer w-full rounded-[20px] bg-card shadow-md shadow-shadow-main overflow-hidden">
  <div className="overflow-x-auto scrollbar-custom w-full max-h-[100vh]">
                <div className="flex items-center gap-2 px-4 py-4">
                    <h2 className="font-semibold">Appointments Details</h2>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info
                                    size={16}
                                    className="text-text-muted cursor-pointer"
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    This table shows all scheduled appointments.
                                    <br />
                                    <br />
                                    Each row contains patient information,
                                    appointment time and date, assigned doctor,
                                    appointment type (Virtual/Physical), and
                                    status.
                                    <br />
                                    <br />
                                    Click on any row to view full
                                    appointment details.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <table className="min-w-full w-full border-collapse divide-y divide-border mt-2 table-auto">
                    <thead className="bg-accent">
                        <tr>
                            <th className="px-4 py-5 text-left text-sm font-bold text-accent-foreground uppercase tracking-wider">
                                Patient Name
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-accent-foreground uppercase tracking-wider">
                                Age
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-accent-foreground uppercase tracking-wider">
                                Id
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-accent-foreground uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-accent-foreground uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-accent-foreground uppercase tracking-wider">
                                Doctor&apos;s Name
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-accent-foreground uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-accent-foreground uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                        {renderTableRows()}
                    </tbody>
                </table>
            </div>
            <AppointmentsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default DashboardAppointments;
