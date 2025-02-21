// src/components/patients/PatientProfile.tsx

"use client";

import { useFetchPatientDetailsById } from "@/hooks/useFetchPatientDetailsById";
import { useUpdateMedicalInfo } from "@/hooks/useUpdateMedicalInfo";
import { MedicalInformation, Patient } from "@/lib/definitions";
import { useState, useEffect } from "react";
import PatientSidebar from "./ui/patient-profile/PatientSidebar";
import AppointmentsTimeline from "./ui/patient-profile/AppointmentsTimeline";
import PatientNotes from "./ui/patient-profile/PatientAppointmentNotes";
import DocumentsSection from "./ui/patient-profile/DocumentsSection";
import MedicalInfoSection from "./ui/patient-profile/MedicalInfoSection";
import { useRouter } from "next/navigation";

export default function PatientProfile({ patient }: { patient: Patient }) {
    const router = useRouter();
    const { data, isLoading, isError } = useFetchPatientDetailsById(
        patient.patientId
    );
    const updateMedicalInfo = useUpdateMedicalInfo();

    const [editingMedicalInfo, setEditingMedicalInfo] = useState(false);
    const [medicalData, setMedicalData] = useState<Partial<MedicalInformation>>(
        data?.medicalInformation?.[0] || {}
    );

    // Handle navigation back if data fails to load
    useEffect(() => {
        if (isError) {
            router.back();
        }
    }, [isError, router]);

    const handleMedicalInfoUpdate = async (
        data: Partial<MedicalInformation>
    ) => {
        try {
            await updateMedicalInfo.mutateAsync({
                patientId: patient.patientId,
                data,
            });
            setEditingMedicalInfo(false);
        } catch (error) {
            console.error("Failed to update medical info:", error);
        }
    };

    if (isLoading) return <div className="p-6">Loading patient details...</div>;
    if (!data) return <div className="p-6">Patient not found</div>;

    // Get most recent appointment
    const lastAppointment = data.appointments[0];

    return (
        <div className="flex flex-col md:flex-row gap-6 p-4">
            {/* Left Sidebar */}
            <div className="w-auto md:w-auto">
                <PatientSidebar patient={data} />
            </div>

            {/* Main Content */}
            <div className="w-full md:w-full space-y-8">
                <MedicalInfoSection data={data.medicalInformation?.[0]} />
                <AppointmentsTimeline appointments={data.appointments} />
                <div className="flex flex-row gap-4 w-full h-full">
                    <div className="w-1/2 h-full">
                        <PatientNotes
                            doctorNotes={
                                lastAppointment?.doctorAppointmentNotes ||
                                "No doctor notes available"
                            }
                            patientNotes={
                                lastAppointment?.patientAppointmentNotes ||
                                "No patient notes available"
                            }
                        />
                    </div>
                    <div className="w-1/2 h-full">
                        <DocumentsSection patientId={data.patientId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
