// File: src/components/dashboard/ui/DashboardAppointments.tsx

"use client";

import AppointmentsPagination from "@/components/appointments/ui/appointments-table/AppointmentsPagination";
import { Appointment } from "@/lib/definitions";
import { differenceInYears } from "date-fns";
import { MapPin as PlaceIcon, Video } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

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

    // Handle page changes for pagination
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    // Get appointments for the current page
    const currentAppointments = appointments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderTableRows = () =>
        currentAppointments.map((appointment) => {
            const isCancelled = appointment.status === "CANCELLED";
            const rowClass = isCancelled ? "bg-red-100" : "bg-white";

            const onRowClick = () => {
                router.push(
                    `/dashboard/appointments/${appointment.appointmentId}`
                );
            };

            return (
                <tr
                    key={appointment.appointmentId}
                    className={`text-center cursor-pointer ${rowClass} hover:bg-gray-100 active:bg-blue-100/50`}
                    onClick={onRowClick}
                >
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900 text-left whitespace-nowrap">
                        {appointment.patient?.user?.profile?.firstName &&
                        appointment.patient?.user?.profile?.lastName
                            ? `${appointment.patient.user.profile.firstName} ${appointment.patient.user.profile.lastName}`
                            : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {appointment.patient?.user?.profile?.dateOfBirth
                            ? differenceInYears(
                                  new Date(),
                                  new Date(
                                      appointment.patient.user.profile.dateOfBirth
                                  )
                              )
                            : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {appointment.patient?.patientId || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(
                            appointment.appointmentDate
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(
                            appointment.appointmentDate
                        ).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {appointment.doctor?.user?.profile
                            ? `Dr. ${appointment.doctor.user.profile.firstName} ${appointment.doctor.user.profile.lastName}`
                            : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm flex items-center justify-center gap-2 whitespace-nowrap">
                        {appointment.type === "Virtual" ? (
                            <>
                                <Video className="text-primary" />
                                <span className="text-primary">
                                    {appointment.type}
                                </span>
                            </>
                        ) : (
                            <>
                                <PlaceIcon className="text-black/70" />
                                <span className="text-black/70">
                                    {appointment.type}
                                </span>
                            </>
                        )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {appointment.status}
                    </td>
                </tr>
            );
        });

    return (
        <div className="flex flex-col min-w-full min-h-[90%] shadow-lg shadow-gray-300 rounded-[20px] bg-slate-100">
            <div className="overflow-x-auto w-full min-h-[90%]">
                <h2 className="py-4 px-4 font-semibold">
                    Appointments Details
                </h2>
                <table className="min-w-full w-full border-collapse divide-y divide-gray-200 mt-2 table-auto">
                    <thead className="bg-bluelight">
                        <tr>
                            <th className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider">
                                Patient Name
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Age
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Id
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Doctor&apos;s Name
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
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
