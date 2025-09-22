// src/components/patients/PatientProfile.tsx

"use client";

import { useFetchPatientDetailsById } from "@/hooks/useFetchPatientDetailsById";
import { useUpdateMedicalInfo } from "@/hooks/useUpdateMedicalInfo";
import { MedicalInformation, Patient } from "@/lib/definitions";
import { useState, useEffect } from "react";
import PatientSidebar from "./ui/patient-sidebar/PatientSidebar";
import AppointmentsTimeline from "./ui/patient-profile/AppointmentsTimeline";
import PatientNotes from "./ui/patient-profile/PatientAppointmentNotes";
import DocumentsSection from "./ui/patient-profile/DocumentsSection";
import MedicalInfoSection from "./ui/patient-profile/MedicalInfoSection";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

    // Get most recent and second-to-last appointments
    const lastTwoAppointments = data.appointments.slice(0, 2);
    const allNotes = lastTwoAppointments.flatMap(
        (appointment) => appointment.notes || []
    );

    const profile = data.user?.profile;
    const fullName = `${profile?.firstName ?? ""} ${
        profile?.lastName ?? ""
    }`.trim();

    return (
        <div className="flex flex-col gap-1">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumbs text-sm px-4">
                <ul className="flex gap-2">
                    <li className="bg-slate p-2">
                        <Link
                            href="/dashboard/patients"
                            className="text-primary hover:text-blue-700"
                        >
                            Patients
                        </Link>
                    </li>
                    <span className="bg-slate p-2">|</span>
                    <li className="bg-slate p-2">
                        <Link
                            href={`/dashboard/patients/${patient.patientId}`}
                            className="font-semibold text-muted-foreground hover:text-primary"
                        >
                            {fullName || "Unnamed Patient"}
                        </Link>
                    </li>
                </ul>
            </nav>

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
                                notes={allNotes}
                                appointments={lastTwoAppointments}
                            />
                        </div>
                        <div className="w-1/2 h-full">
                            <DocumentsSection patientId={data.patientId} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
