// src/components/patients/ui/patient-profile/PatientNotes.tsx

"use client";

import React from "react";

interface PatientNotesProps {
    doctorNotes: string;
    patientNotes: string;
}

export default function PatientNotes({
    doctorNotes,
    patientNotes,
}: PatientNotesProps) {
    return (
        <div className="bg-white p-4 rounded-[10px] shadow-md">
            <h2 className="p-2 bg-bluelight/10 rounded-[10px] text-base text-primary font-semibold mb-4">
                Appointment Notes
            </h2>

            <div className="p-2">
                {/* Doctor's Appointment Notes */}
                <div className="mb-4 text-[15px]">
                    <strong>Doctor Notes:</strong> <span>{doctorNotes}</span>
                </div>

                {/* Patient's Appointment Notes */}
                <div className="mb-4 text-[15px]">
                    <strong>Patient Notes:</strong> <span>{patientNotes}</span>
                </div>
            </div>
        </div>
    );
}
