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
    appointments
}: PatientAppointmentNotesProps) {
    // Sort notes by creation date (newest first)
    const sortedNotes = [...notes].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Get role display name with proper capitalization
    const formatRole = (role: string) => {
        return role.toLowerCase().split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    // Group notes by appointment
    const notesByAppointment = appointments.reduce((acc, appointment) => {
        acc[appointment.appointmentId] = {
            date: appointment.appointmentDate,
            notes: appointment.notes || []
        };
        return acc;
    }, {} as Record<string, { date: Date; notes: AppointmentNote[] }>);

    return (
        <div className="bg-white p-4 rounded-[10px] shadow-md">
            <h2 className="p-2 bg-bluelight/10 rounded-[10px] text-base text-primary font-semibold mb-4">
                Appointment Notes (Last 2 Appointments)
            </h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {Object.entries(notesByAppointment).map(([appointmentId, { date, notes }]) => (
                    <div key={appointmentId} className="mb-6">
                        <div className="text-sm font-medium text-gray-500 mb-2">
                            Appointment on {format(new Date(date), 'MMM dd, yyyy')}
                        </div>
                        {notes.length === 0 ? (
                            <div className="text-gray-400 text-sm pl-2">
                                No notes for this appointment
                            </div>
                        ) : (
                            notes.map((note) => (
                                <div 
                                    key={note.appointmentNoteId}
                                    className="p-3 border-b border-gray-100 last:border-0"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <strong className="text-sm font-medium">
                                                {note.author.profile?.firstName} {note.author.profile?.lastName}
                                            </strong>
                                            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {formatRole(note.authorRole)}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {format(new Date(note.createdAt), 'MMM dd, HH:mm')}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {note.content}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}