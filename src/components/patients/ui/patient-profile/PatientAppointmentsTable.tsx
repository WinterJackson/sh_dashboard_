// src/components/patients/PatientAppointmentsTable.tsx

"use client";

import { Appointment } from "@/lib/definitions";
import { format } from "date-fns";
import { NotesFieldModal } from "../patient-modals/NotesFieldModal";
import { ServicesFieldModal } from "../patient-modals/ServicesFieldModal";
import { PaymentsFieldModal } from "../patient-modals/PaymentsFieldModal";
import { DiagnosisFieldModal } from "../patient-modals/DiagnosisFieldModal";
import { PrescriptionFieldModal } from "../patient-modals/PrescriptionFieldModal";
import { NotebookPen, HandHeart, Coins, Stethoscope, Pill } from "lucide-react";

export default function PatientAppointmentsTable({
    appointments,
}: {
    appointments: Appointment[];
}) {
    return (
        <div className="mt-4">
            <div className="overflow-x-auto">
                <table className="min-w-max w-full text-sm">
                    <thead>
                        <tr className="text-left bg-bluelight/10 border-b-2 border-gray-200">
                            <th className="p-4"></th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Date
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Time
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Type
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Status
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Treatment
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Doctor
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Services
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Payment
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Diagnosis
                                </span>
                            </th>
                            <th className="p-4">
                                <span className="flex justify-center">
                                    Prescription
                                </span>
                            </th>
                            <th className="p-4">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => {
                            const docProfile = appointment.doctor?.user.profile;
                            const doctorFullName = docProfile
                                ? `Dr. ${docProfile.firstName} ${docProfile.lastName}`
                                : undefined;

                            return (
                                <tr
                                    key={appointment.appointmentId}
                                    className="border-b border-gray-100 hover:bg-gray-50"
                                >
                                    <td className="py-4 px-1">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                        />
                                    </td>

                                    <td className="p-4 border-l-2">
                                        <span className="flex justify-center">
                                            {format(
                                                new Date(
                                                    appointment.appointmentDate
                                                ),
                                                "MM/dd/yyyy"
                                            )}
                                        </span>
                                    </td>

                                    <td className="p-4 border-l-2">
                                        <span className="flex justify-center">
                                            {format(
                                                new Date(
                                                    appointment.appointmentDate
                                                ),
                                                "hh:mm a"
                                            )}
                                        </span>
                                    </td>

                                    <td className="p-4 capitalize border-l-2">
                                        <span className="flex justify-center">
                                            {appointment.type}
                                        </span>
                                    </td>

                                    <td className="p-4 capitalize border-l-2">
                                        <span className="flex justify-center">
                                            {appointment.status}
                                        </span>
                                    </td>

                                    <td className="p-4 border-l-2">
                                        <span className="flex justify-center">
                                            {appointment.treatment || "N/A"}
                                        </span>
                                    </td>

                                    <td className="p-4 border-l-2">
                                        <span className="flex justify-center">
                                            {doctorFullName ?? "N/A"}
                                        </span>
                                    </td>

                                    <td className="p-4 border-l-2">
                                        <div className="flex justify-center">
                                            <ServicesFieldModal
                                                services={appointment.services}
                                            >
                                                <HandHeart className="cursor-pointer" />
                                            </ServicesFieldModal>
                                        </div>
                                    </td>

                                    <td className="p-4 border-l-2">
                                        <div className="flex justify-center">
                                            <PaymentsFieldModal
                                                payments={appointment.payments}
                                            >
                                                <Coins className="cursor-pointer" />
                                            </PaymentsFieldModal>
                                        </div>
                                    </td>

                                    <td className="p-4 border-l-2">
                                        <div className="flex justify-center">
                                            <DiagnosisFieldModal
                                                diagnosis={
                                                    appointment.diagnosis
                                                }
                                                authorName={doctorFullName}
                                                createdAt={
                                                    appointment.updatedAt
                                                }
                                            >
                                                <Stethoscope className="cursor-pointer" />
                                            </DiagnosisFieldModal>
                                        </div>
                                    </td>
                                    <td className="p-4 border-l-2">
                                        <div className="flex justify-center">
                                            <PrescriptionFieldModal
                                                prescription={
                                                    appointment.prescription
                                                }
                                                authorName={
                                                    appointment.doctor
                                                        ? `Dr. ${
                                                              appointment.doctor
                                                                  .user.profile
                                                                  ?.firstName ??
                                                              ""
                                                          } ${
                                                              appointment.doctor
                                                                  .user.profile
                                                                  ?.lastName ??
                                                              ""
                                                          }`
                                                        : undefined
                                                }
                                                createdAt={
                                                    appointment.updatedAt
                                                }
                                            >
                                                <Pill className="cursor-pointer" />
                                            </PrescriptionFieldModal>
                                        </div>
                                    </td>

                                    <td className="p-4 border-l-2">
                                        <div className="flex justify-center">
                                            <NotesFieldModal
                                                notes={appointment.notes}
                                            >
                                                <NotebookPen className="cursor-pointer" />
                                            </NotesFieldModal>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {appointments.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                        No appointments found
                    </div>
                )}
            </div>
        </div>
    );
}
