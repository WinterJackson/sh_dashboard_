// src/components/patients/ui/patient-profile/PatientAppointmentNotes.tsx

"use client";

import React from "react";

interface PatientAppointmentNotesProps {
    doctorNotes: string;
    patientNotes: string;
}

export default function PatientAppointmentNotes({
    doctorNotes,
    patientNotes,
}: PatientAppointmentNotesProps) {
    return (
        <div className="bg-white p-4 rounded-[10px] shadow-md">
            <h2 className="p-2 bg-bluelight/10 rounded-[10px] text-base text-primary font-semibold mb-4">
                Appointment Notes
            </h2>

            <div className="p-2">
                {/* Doctor's latest Appointment Note */}
                <div className="mb-4 text-[15px]">
                    <strong>Doctor:</strong> <span>{doctorNotes}</span>
                </div>

                {/* Patient's latest Appointment Note */}
                <div className="mb-4 text-[15px]">
                    <strong>Patient:</strong> <span>{patientNotes}</span>
                </div>
            </div>
        </div>
    );
}
