// src/components/patients/ui/patient-profile/PatientAppointmentNotes.tsx

import React from "react";
import { AppointmentNote, Appointment } from "@/lib/definitions";
import { format } from "date-fns";

interface PatientAppointmentNotesProps {
    notes: AppointmentNote[];
    appointments: Appointment[];
}

export default function PatientAppointmentNotes({
    notes,
    appointments,
}: PatientAppointmentNotesProps) {
    // Sort notes by creation date (newest first)
    const sortedNotes = [...notes].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Get role display name with proper capitalization
    const formatRole = (role: string) => {
        return role
            .toLowerCase()
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    // Group notes by appointment
    const notesByAppointment = appointments.reduce((acc, appointment) => {
        acc[appointment.appointmentId] = {
            date: appointment.appointmentDate,
            notes: appointment.notes || [],
        };
        return acc;
    }, {} as Record<string, { date: Date; notes: AppointmentNote[] }>);

    return (
        <div className="bg-slate p-4 rounded-[10px] shadow-md">
            <h2 className="p-2 bg-bluelight/10 rounded-[10px] text-base text-primary font-semibold mb-4">
                Appointment Notes
                <p className="text-xs text-primary font-semibold">
                    (Last 2 Appointments)
                </p>
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {Object.entries(notesByAppointment).map(
                    ([appointmentId, { date, notes }]) => (
                        <div key={appointmentId} className="mb-6">
                            <div className="text-sm font-medium text-gray-500 mb-2 p-2 border-b border-gray-300 last:border-0">
                                Appointment on{" "}
                                {format(new Date(date), "MMM dd, yyyy")}
                            </div>
                            {notes.length === 0 ? (
                                <div className="text-gray-400 text-sm pl-2">
                                    No notes for this appointment
                                </div>
                            ) : (
                                notes.map((note) => (
                                    <div
                                        key={note.appointmentNoteId}
                                        className="p-3 border-b border-gray-300 last:border-0"
                                    >
                                        <div className="grid justify-between items-start mb-2">
                                            <div className="justify-between">
                                                <strong className="text-sm whitespace-nowrap font-medium bg-gray-200 p-1 rounded-[5px]">
                                                    {note.author.profile?.firstName}{" "}
                                                    {note.author.profile?.lastName}
                                                </strong>
                                                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-2 rounded-[5px]">
                                                    {formatRole(
                                                        note.authorRole
                                                    )}
                                                </span>
                                            </div>
                                            <p className="p-1 text-sm text-gray-700">
                                                {note.content}
                                            </p>
                                        </div>
                                        <span className="p-1 text-xs grid text-gray-400">
                                            {format(
                                                new Date(note.createdAt),
                                                "MMM dd, HH:mm"
                                            )}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
