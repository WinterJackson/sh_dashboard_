// src/components/appointments/DashboardAppointments.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import PlaceIcon from "@mui/icons-material/Place";
import { Appointment } from "@/lib/definitions";
import { useSessionData } from "@/hooks/useSessionData";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 15;

const DashboardAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const sessionData = useSessionData();
    const { role, hospitalId } = sessionData?.user || {};

    // Fetch appointments data based on user role
    const fetchAppointmentsData = async (page: number) => {
        setLoading(true);
        try {
            let appointmentsData = [];
            let totalAppointmentsCount = 0;

            if (role === "SUPER_ADMIN") {
                // Fetch all appointments
                const response = await fetch(
                    `/api/appointments?page=${page}&limit=${ITEMS_PER_PAGE}`
                );
                const data = await response.json();
                appointmentsData = data.appointments;
                totalAppointmentsCount = data.totalAppointments;
            } else if (hospitalId) {
                // Fetch appointments by hospital
                const response = await fetch(
                    `/api/appointments/byHospital/${hospitalId}?page=${page}&limit=${ITEMS_PER_PAGE}`
                );
                const data = await response.json();
                appointmentsData = data.appointments;
                totalAppointmentsCount = data.totalAppointments;
            }

            setAppointments(appointmentsData || []);
            setTotalAppointments(totalAppointmentsCount || 0);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role) {
            fetchAppointmentsData(currentPage);
        }
    }, [currentPage, role, hospitalId]);

    // Handle page changes
    const handlePageChange = (newPage: number) => {
        if (
            newPage >= 1 &&
            newPage <= Math.ceil(totalAppointments / ITEMS_PER_PAGE)
        ) {
            setCurrentPage(newPage);
        }
    };

    const totalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col min-w-full shadow-lg shadow-gray-300 rounded-[20px] bg-slate-100">
            <div className="overflow-x-auto w-full">
                <h2 className="py-4 px-4 font-semibold">
                    Appointments Details
                </h2>
                <table className="min-w-full w-full border-collapse divide-y divide-gray-200 mt-2 table-auto">
                    <thead className="bg-bluelight">
                        <tr>
                            <th className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
                                Patient Name
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
                                Age
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
                                Id
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
                                Time
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
                                Date
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
                                Doctor's Name
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
                                Type
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading
                            ? Array.from({ length: 15 }).map((_, index) => (
                                  <tr key={index}>
                                      <td colSpan={8}>
                                          <Skeleton className="h-[45px] w-full p-4 rounded-sm py-4" />
                                      </td>
                                  </tr>
                              ))
                            : appointments.map((appointment) => (
                                  <tr
                                      key={appointment.appointmentId}
                                      className={`text-center ${
                                          appointment.status === "Cancelled"
                                              ? "bg-red-100"
                                              : ""
                                      }`}
                                  >
                                      <td className="px-4 py-4 text-sm font-semibold text-gray-900 text-left whitespace-nowrap">
                                          {appointment.patient.name}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                          {appointment.patient.dateOfBirth
                                              ? new Date().getFullYear() -
                                                new Date(
                                                    appointment.patient.dateOfBirth
                                                ).getFullYear()
                                              : "N/A"}
                                      </td>
                                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                          {appointment.patient.patientId}
                                      </td>
                                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                          {new Date(
                                              appointment.appointmentDate
                                          ).toLocaleTimeString()}
                                      </td>
                                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                          {new Date(
                                              appointment.appointmentDate
                                          ).toLocaleDateString()}
                                      </td>
                                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                          {appointment.doctor.user.profile
                                              ? `Dr. ${appointment.doctor.user.profile.firstName} ${appointment.doctor.user.profile.lastName}`
                                              : "N/A"}
                                      </td>
                                      <td className="px-4 py-4 text-sm flex items-center justify-center gap-2 whitespace-nowrap">
                                          {appointment.type === "Virtual" ? (
                                              <>
                                                  <VideoCameraFrontIcon className="text-primary" />
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
                              ))}
                    </tbody>
                </table>
            </div>

            <Pagination className="mt-4 bg-bluelight p-4 rounded-b-2xl">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded-[10px] mr-4 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Previous
                </PaginationPrevious>

                <PaginationContent className="flex items-center gap-2">
                    {currentPage > 3 && (
                        <>
                            <PaginationItem
                                onClick={() => handlePageChange(1)}
                                className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
                            >
                                1
                            </PaginationItem>
                            <PaginationEllipsis className="px-3 py-1 text-gray-500" />
                        </>
                    )}

                    {currentPage > 2 && (
                        <PaginationItem
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
                        >
                            {currentPage - 1}
                        </PaginationItem>
                    )}

                    <PaginationItem
                        isActive={true}
                        className="px-3 py-1 rounded-[10px] bg-primary text-white cursor-pointer"
                    >
                        {currentPage}
                    </PaginationItem>

                    {currentPage < totalPages - 1 && (
                        <PaginationItem
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
                        >
                            {currentPage + 1}
                        </PaginationItem>
                    )}

                    {currentPage < totalPages - 2 && (
                        <>
                            <PaginationEllipsis className="px-3 py-1 text-gray-500" />
                            <PaginationItem
                                onClick={() => handlePageChange(totalPages)}
                                className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
                            >
                                {totalPages}
                            </PaginationItem>
                        </>
                    )}
                </PaginationContent>

                <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded-[10px] ml-4 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Next
                </PaginationNext>
            </Pagination>
        </div>
    );
};

export default DashboardAppointments;
