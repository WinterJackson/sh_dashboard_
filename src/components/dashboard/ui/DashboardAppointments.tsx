// File: src/components/dashboard/ui/DashboardAppointments.tsx

"use client";

import React, { useState } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { MapPin as PlaceIcon, Video } from "lucide-react";
import { Appointment } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardAppointmentsProps {
    session: {
        user: {
            role: string;
            hospitalId: number | null;
        };
    };
    appointments: Appointment[];
    totalAppointments: number;
}

const ITEMS_PER_PAGE = 15;

const DashboardAppointments: React.FC<DashboardAppointmentsProps> = ({
    session,
    appointments,
    totalAppointments,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE);

    // Calculate appointments to display for current page
    const currentAppointments = appointments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const renderTableRows = () => {
        if (currentAppointments.length === 0) {
            return (
                <tr>
                    <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                        No appointments found.
                    </td>
                </tr>
            );
        }

        return currentAppointments.map((appointment) => (
            <tr
                key={appointment.appointmentId}
                className={`text-center ${
                    appointment.status === "Cancelled" ? "bg-red-100" : ""
                }`}
            >
                <td className="px-4 py-4 text-sm font-semibold text-gray-900 text-left whitespace-nowrap">
                    {appointment.patient.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {appointment.patient.dateOfBirth
                        ? new Date().getFullYear() -
                          new Date(appointment.patient.dateOfBirth).getFullYear()
                        : "N/A"}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {appointment.patient.patientId}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(appointment.appointmentDate).toLocaleTimeString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {appointment.doctor.user.profile
                        ? `Dr. ${appointment.doctor.user.profile.firstName} ${appointment.doctor.user.profile.lastName}`
                        : "N/A"}
                </td>
                <td className="px-4 py-4 text-sm flex items-center justify-center gap-2 whitespace-nowrap">
                    {appointment.type === "Virtual" ? (
                        <>
                            <Video className="text-primary" />
                            <span className="text-primary">{appointment.type}</span>
                        </>
                    ) : (
                        <>
                            <PlaceIcon className="text-black/70" />
                            <span className="text-black/70">{appointment.type}</span>
                        </>
                    )}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {appointment.status}
                </td>
            </tr>
        ));
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex flex-col min-w-full shadow-lg shadow-gray-300 rounded-[20px] bg-slate-100">
            <div className="overflow-x-auto w-full">
                <h2 className="py-4 px-4 font-semibold">Appointments Details</h2>
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
                        {renderTableRows()}
                    </tbody>
                </table>
            </div>
            <Pagination className="mt-4 bg-bluelight p-4 rounded-b-2xl">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 bg-gray-300 text-black rounded-[10px] mr-4 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer"
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
                            <PaginationEllipsis className="px-3 py-1 text-black" />
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
                    className="px-3 py-1 mx-1 bg-gray-300 text-black rounded-[10px] ml-4 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer"
                >
                    Next
                </PaginationNext>
            </Pagination>
        </div>
    );
};

export default DashboardAppointments;




// CODE USING ROUTE API 

// File: src/components/dashboard/ui/DashboardAppointments.tsx

// "use client";

// import React, { useState } from "react";
// import {
//     Pagination,
//     PaginationContent,
//     PaginationItem,
//     PaginationPrevious,
//     PaginationNext,
//     PaginationEllipsis,
// } from "@/components/ui/pagination";
// import { MapPin as PlaceIcon, Video } from "lucide-react";
// import { Appointment } from "@/lib/definitions";
// import { Skeleton } from "@/components/ui/skeleton";

// interface DashboardAppointmentsProps {
//     session: {
//         user: {
//             role: string;
//             hospitalId: number | null;
//         };
//     };
//     appointments: Appointment[];
//     totalAppointments: number;
//     page: number;
//     pageSize: number;
// }

// const DashboardAppointments: React.FC<DashboardAppointmentsProps> = ({
//     session,
//     appointments,
//     totalAppointments,
//     page: initialPage,
//     pageSize,
// }) => {
//     const [currentPage, setCurrentPage] = useState(initialPage);
//     const [currentAppointments, setCurrentAppointments] = useState<Appointment[]>(appointments);
//     const [loading, setLoading] = useState(false);

//     const totalPages = Math.ceil(totalAppointments / pageSize);

//     const handlePageChange = async (newPage: number) => {
//         if (newPage < 1 || newPage > totalPages) return;

//         setLoading(true);

//         try {
//             const response = await fetch(
//                 `/api/appointments?page=${newPage}&pageSize=${pageSize}&role=${session.user.role}&hospitalId=${session.user.hospitalId}`
//             );
//             const data = await response.json();

//             setCurrentAppointments(data.appointments);
//             setCurrentPage(newPage);
//         } catch (error) {
//             console.error("Error fetching appointments:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const renderTableRows = () => {
//         if (loading) {
//             return Array.from({ length: pageSize }).map((_, index) => (
//                 <tr key={index}>
//                     <td colSpan={8}>
//                         <Skeleton className="h-[45px] w-full p-4 rounded-sm py-4" />
//                     </td>
//                 </tr>
//             ));
//         }

//         if (currentAppointments.length === 0) {
//             return (
//                 <tr>
//                     <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
//                         No appointments found.
//                     </td>
//                 </tr>
//             );
//         }

//         return currentAppointments.map((appointment) => (
//             <tr
//                 key={appointment.appointmentId}
//                 className={`text-center ${
//                     appointment.status === "Cancelled" ? "bg-red-100" : ""
//                 }`}
//             >
//                 <td className="px-4 py-4 text-sm font-semibold text-gray-900 text-left whitespace-nowrap">
//                     {appointment.patient.name}
//                 </td>
//                 <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
//                     {appointment.patient.dateOfBirth
//                         ? new Date().getFullYear() -
//                           new Date(appointment.patient.dateOfBirth).getFullYear()
//                         : "N/A"}
//                 </td>
//                 <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
//                     {appointment.patient.patientId}
//                 </td>
//                 <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
//                     {new Date(appointment.appointmentDate).toLocaleTimeString()}
//                 </td>
//                 <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
//                     {new Date(appointment.appointmentDate).toLocaleDateString()}
//                 </td>
//                 <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
//                     {appointment.doctor.user.profile
//                         ? `Dr. ${appointment.doctor.user.profile.firstName} ${appointment.doctor.user.profile.lastName}`
//                         : "N/A"}
//                 </td>
//                 <td className="px-4 py-4 text-sm flex items-center justify-center gap-2 whitespace-nowrap">
//                     {appointment.type === "Virtual" ? (
//                         <>
//                             <Video className="text-primary" />
//                             <span className="text-primary">{appointment.type}</span>
//                         </>
//                     ) : (
//                         <>
//                             <PlaceIcon className="text-black/70" />
//                             <span className="text-black/70">{appointment.type}</span>
//                         </>
//                     )}
//                 </td>
//                 <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
//                     {appointment.status}
//                 </td>
//             </tr>
//         ));
//     };

//     return (
//         <div className="flex flex-col min-w-full shadow-lg shadow-gray-300 rounded-[20px] bg-slate-100">
//             <div className="overflow-x-auto w-full">
//                 <h2 className="py-4 px-4 font-semibold">Appointments Details</h2>
//                 <table className="min-w-full w-full border-collapse divide-y divide-gray-200 mt-2 table-auto">
//                     <thead className="bg-bluelight">
//                         <tr>
//                             <th className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
//                                 Patient Name
//                             </th>
//                             <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
//                                 Age
//                             </th>
//                             <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
//                                 Id
//                             </th>
//                             <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
//                                 Time
//                             </th>
//                             <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
//                                 Date
//                             </th>
//                             <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
//                                 Doctor's Name
//                             </th>
//                             <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
//                                 Type
//                             </th>
//                             <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap">
//                                 Status
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {renderTableRows()}
//                     </tbody>
//                 </table>
//             </div>
//             <Pagination className="mt-4 bg-bluelight p-4 rounded-b-2xl">
//                 <PaginationPrevious
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1 mx-1 bg-gray-300 text-black rounded-[10px] mr-4 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer"
//                 >
//                     Previous
//                 </PaginationPrevious>

//                 <PaginationContent className="flex items-center gap-2">
//                     {currentPage > 3 && (
//                         <>
//                             <PaginationItem
//                                 onClick={() => handlePageChange(1)}
//                                 className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
//                             >
//                                 1
//                             </PaginationItem>
//                             <PaginationEllipsis className="px-3 py-1 text-gray-500" />
//                         </>
//                     )}

//                     {currentPage > 2 && (
//                         <PaginationItem
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
//                         >
//                             {currentPage - 1}
//                         </PaginationItem>
//                     )}

//                     <PaginationItem
//                         isActive={true}
//                         className="px-3 py-1 rounded-[10px] bg-primary text-white cursor-pointer"
//                     >
//                         {currentPage}
//                     </PaginationItem>

//                     {currentPage < totalPages - 1 && (
//                         <PaginationItem
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
//                         >
//                             {currentPage + 1}
//                         </PaginationItem>
//                     )}

//                     {currentPage < totalPages - 2 && (
//                         <>
//                             <PaginationEllipsis className="px-3 py-1 text-black" />
//                             <PaginationItem
//                                 onClick={() => handlePageChange(totalPages)}
//                                 className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
//                             >
//                                 {totalPages}
//                             </PaginationItem>
//                         </>
//                     )}
//                 </PaginationContent>

//                 <PaginationNext
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1 mx-1 bg-gray-300 text-black rounded-[10px] ml-4 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer"
//                 >
//                     Next
//                 </PaginationNext>
//             </Pagination>
//         </div>
//     );
// };

// export default DashboardAppointments;

