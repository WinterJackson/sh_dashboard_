// src/components/patients/PatientAppointmentsTable.tsx

"use client";

import { Appointment } from "@/lib/definitions";
import { format } from "date-fns";
import { NotebookPen } from 'lucide-react';

const PatientAppointmentsTable = ({
    appointments,
}: {
    appointments: Appointment[];
}) => {
    return (
        <div className="mt-4 overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left bg-bluelight/10 border-b-2 border-gray-200">
                        <th className="p-4 w-[5%]">
                        </th>
                        <th className="p-4 w-[15%]">Date</th>
                        <th className="p-4 w-[15%]">Time</th>
                        <th className="p-4 w-[15%]">Type</th>
                        <th className="p-4 w-[20%]">Treatment</th>
                        <th className="p-4 w-[20%]">Doctor</th>
                        <th className="p-4 w-[10%]">Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr
                            key={appointment.appointmentId}
                            className="border-b text-[14px] border-gray-100 hover:bg-gray-50"
                        >
                            <td className="py-4 px-1 items-center">
                                <input type="checkbox" className="w-4 h-4" />
                            </td>
                            <td className="py-4">
                                {format(
                                    new Date(appointment.appointmentDate),
                                    "dd MMM yy"
                                )}
                            </td>
                            <td className="py-4">
                                {format(
                                    new Date(appointment.appointmentDate),
                                    "HH:mm"
                                )}
                            </td>
                            <td className="py-4 capitalize">
                                {appointment.type}
                            </td>
                            <td className="py-4">
                                {appointment.treatment || "N/A"}
                            </td>
                            <td className="py-4">
                                Dr. {appointment.doctor?.user.profile?.firstName +
                                    " " +
                                    appointment.doctor?.user.profile?.lastName}
                            </td>
                            <td className="py-4">
                                <NotebookPen />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {appointments.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                    No appointments found
                </div>
            )}
        </div>
    );
};

export default PatientAppointmentsTable;