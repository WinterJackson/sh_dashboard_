// src/components/appointments/ui/appointment-page/AppointmentDetails.tsx
"use client";

import { useSession } from "next-auth/react";
import { useFetchAppointmentById } from "@/hooks/useFetchAppointmentById";
import { differenceInYears, format, differenceInMinutes } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tab";
import { ServicesFieldModal } from "@/components/patients/ui/patient-modals/ServicesFieldModal";
import { PaymentsFieldModal } from "@/components/patients/ui/patient-modals/PaymentsFieldModal";
import { NotesFieldModal } from "@/components/patients/ui/patient-modals/NotesFieldModal";
import { DiagnosisFieldModal } from "@/components/patients/ui/patient-modals/DiagnosisFieldModal";
import { PrescriptionFieldModal } from "@/components/patients/ui/patient-modals/PrescriptionFieldModal";
import {
    HandHeart,
    Coins,
    NotebookPen,
    Stethoscope,
    Pill,
    Cross,
    CalendarClock,
    Hospital,
    CheckCircle,
    Video,
} from "lucide-react";
import { Role, Session } from "@/lib/definitions";
import Image from "next/image";

interface AppointmentDetailsProps {
    appointmentId: string;
}

export default function AppointmentDetails({
    appointmentId,
}: AppointmentDetailsProps) {
    const { data: session } = useSession();

    const user = session?.user
        ? {
              role: session.user.role as Role,
              hospitalId: session.user.hospitalId,
              userId: session.user.id,
          }
        : undefined;

    const { data: appointment, error } = useFetchAppointmentById(
        appointmentId,
        user
    );

    console.log("Raw session data:", session);

    if (!session?.user) {
        console.error("No session found - redirect handled in parent");
        return <div>Unauthorized access</div>;
    }

    const role = session?.user?.role as Role;
    console.log("User role:", role);
    console.log("Hospital ID:", session?.user?.hospitalId);

    if (error) throw error;
    if (!appointment) return null;

    // calculate appointment duration
    const getDuration = () => {
        if (!appointment.appointmentDate || !appointment.appointmentEndAt)
            return "N/A";

        const start = new Date(appointment.appointmentDate);
        const end = new Date(appointment.appointmentEndAt);
        const minutes = differenceInMinutes(end, start);

        return minutes > 0
            ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
            : "N/A";
    };

    // Patient Details
    const patientProfile = appointment.patient.user.profile;
    const patientDetails = {
        name: patientProfile
            ? `${patientProfile.firstName} ${patientProfile.lastName}`
            : "Unknown",
        age: patientProfile?.dateOfBirth
            ? differenceInYears(
                  new Date(),
                  new Date(patientProfile.dateOfBirth)
              )
            : "N/A",
        gender: patientProfile?.gender || "N/A",
        contact: patientProfile?.phoneNo || "N/A",
        emergencyContact: patientProfile?.emergencyContact || "N/A",
        address: `${patientProfile?.address || ""}${
            patientProfile?.cityOrTown ? `, ${patientProfile.cityOrTown}` : ""
        }`,
        county: patientProfile?.county || "N/A",
        nextOfKin: `${patientProfile?.nextOfKin || "N/A"} (${
            patientProfile?.nextOfKinPhoneNo || "No phone"
        })`,
        imageUrl: patientProfile?.imageUrl || "/default-avatar.png",
    };

    // Doctor Details
    const doctorProfile = appointment.doctor.user.profile;
    const doctorDetails = {
        name: doctorProfile
            ? `Dr. ${doctorProfile.firstName} ${doctorProfile.lastName}`
            : "Unknown",
        imageUrl: doctorProfile?.imageUrl || "/doctor-avatar.png",
        specialization:
            appointment.doctor.specialization?.name || "General Practitioner",
        department: appointment.doctor.department?.name || "N/A",
        hospital: appointment.doctor.hospital?.hospitalName || "N/A",
        contact: doctorProfile?.phoneNo || appointment.doctor.phoneNo || "N/A",
        status: appointment.doctor.status || "Unknown",
        experience: appointment.doctor.yearsOfExperience
            ? `${appointment.doctor.yearsOfExperience}`
            : "N/A",
        qualifications: appointment.doctor.qualifications || "Not specified",
        averageRating: appointment.doctor.averageRating || 0,
        workingHours: appointment.doctor.workingHours || "N/A",
    };

    // Hospital Details
    const hospitalDetails = {
        name: appointment.hospital.hospitalName,
        logo: appointment.hospital.logoUrl || "/images/bed.svg",
        address: `${appointment.hospital.streetAddress || ""}${
            appointment.hospital.town ? `, ${appointment.hospital.town}` : ""
        }`,
        phone: appointment.hospital.phone || "N/A",
        email: appointment.hospital.email || "N/A",
        level: appointment.hospital.kephLevel?.replace("_", " ") || "Not rated",
        town: appointment.hospital.town || "N/A",
    };

    return (
        <div>
        <div className="space-y-5 px-5 !w-full">
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumbs text-sm pr-4">
                <ul className="flex gap-2">
                    <li className="bg-slate p-2">
                        <a
                            href="/dashboard/appointments"
                            className="text-primary hover:text-primary/80"
                        >
                            Appointments
                        </a>
                    </li>
                    <span className="bg-slate p-2">|</span>
                    <li className="bg-slate p-2">
                        <a
                            href={`/dashboard/patients/${appointment.patient.patientId}`}
                            className="font-semibold text-muted-foreground hover:text-primary"
                        >
                            Patient - {patientDetails.name || "Unnamed Patient"}
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="w-full flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-[400px]">
                    {/* Patient Card */}
                    <Card className="flex-1 min-w-[300px] bg-card rounded-[10px] shadow-lg shadow-shadow-main">
                        <CardHeader className="bg-accent rounded-t-[10px] mb-2">
                            <CardTitle className="text-[16px] flex justify-between">
                                Patient Details
                                <Cross />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 grid gap-5 mt-6 w-full">
                            <div className="flex flex-col items-center justify-top bg-slate rounded-[10px] p-2">
                                <Image
                                    src={patientDetails.imageUrl}
                                    alt="Patient profile"
                                    width={100}
                                    height={100}
                                    className="w-24 h-24 rounded-full object-cover border-2 border-primary mb-2 mt-6"
                                />
                                <p className="font-medium text-md p-2 text-center">
                                    {patientDetails.name}
                                </p>
                                <p className="text-sm text-center p-2 py-0">
                                    {patientDetails.age} years old
                                </p>
                            </div>

                            <div className="space-y-2 p-2">
                                {/* Personal Information Section */}
                                <div className="grid-cols-1">
                                    <div className="grid grid-cols-1 gap-3">
                                        <p>
                                            <span className="font-semibold text-primary">
                                                Patient ID:
                                            </span>{" "}
                                            {appointment.patient.patientId}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-primary">
                                                Gender:
                                            </span>{" "}
                                            {patientDetails.gender}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-primary">
                                                Date of Birth:
                                            </span>{" "}
                                            {patientProfile?.dateOfBirth
                                                ? format(
                                                      new Date(
                                                          patientProfile.dateOfBirth
                                                      ),
                                                      "PP"
                                                  )
                                                : "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-primary">
                                                Marital Status:
                                            </span>{" "}
                                            {appointment.patient
                                                .maritalStatus || "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-primary">
                                                Occupation:
                                            </span>{" "}
                                            {appointment.patient.occupation ||
                                                "N/A"}
                                        </p>
                                        <p className="mt-3 pt-3 border-t border-foreground ">
                                            <span className="font-semibold text-primary">
                                                Contact:
                                            </span>{" "}
                                            {patientDetails.contact}
                                        </p>
                                        <p>
                                            <span className="font-semibold text-primary">
                                                Email:
                                            </span>{" "}
                                            {appointment.patient.user.email ||
                                                "N/A"}
                                        </p>
                                    </div>

                                    {/* Hospitalization Section */}
                                    <div className="mt-3 pt-3 border-t border-foreground">
                                        <div className="grid grid-cols-1 gap-3">
                                            <p>
                                                <span className="font-semibold text-primary">
                                                    Patient Status:
                                                </span>{" "}
                                                {appointment.patient.status ||
                                                    "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-primary">
                                                    Admission Date:
                                                </span>{" "}
                                                {appointment.patient
                                                    .admissionDate
                                                    ? format(
                                                          new Date(
                                                              appointment.patient.admissionDate
                                                          ),
                                                          "PP"
                                                      )
                                                    : "N/A"}
                                            </p>
                                            <p>
                                                <span className="font-semibold text-primary">
                                                    Discharge Date:
                                                </span>{" "}
                                                {appointment.patient
                                                    .dischargeDate
                                                    ? format(
                                                          new Date(
                                                              appointment.patient.dischargeDate
                                                          ),
                                                          "PP"
                                                      )
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Next of Kin Section */}
                                <div className="mt-3 pt-3 border-t border-foreground grid grid-cols-1 gap-3">
                                    <p>
                                        <span className="font-semibold text-primary">
                                            Next of Kin:
                                        </span>{" "}
                                        {appointment.patient.nextOfKinName ||
                                            "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-primary">
                                            Relationship:
                                        </span>{" "}
                                        {appointment.patient
                                            .nextOfKinRelationship || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-primary">
                                            Kin Phone:
                                        </span>{" "}
                                        {appointment.patient.nextOfKinPhoneNo ||
                                            "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-primary">
                                            Kin Email:
                                        </span>{" "}
                                        {appointment.patient.nextOfKinEmail ||
                                            "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-semibold text-primary">
                                            Kin Address:
                                        </span>{" "}
                                        {appointment.patient
                                            .nextOfKinHomeAddress || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right-side content container */}
                <div className="flex-1 flex flex-col gap-4">
                    <div className="w-full">
                        <Card className="bg-card w-full rounded-[10px] shadow-lg shadow-shadow-main">
                            <CardHeader className="bg-accent rounded-t-[10px] mb-2">
                                <CardTitle className="text-[16px] flex justify-between">
                                    <span className="text-[16px]">
                                        Appointment Summary
                                    </span>
                                    <div className="flex">
                                        {/* Buttons Container */}
                                        <div className="flex justify-between items-center">
                                            {/* Services Button */}
                                            <ServicesFieldModal
                                                services={appointment.services}
                                            >
                                                <button className="flex items-center gap-1 px-2 border-r-2 border-border hover:bg-primary hover:text-primary-foreground transition-colors">
                                                    <HandHeart className="cursor-pointer" />
                                                </button>
                                            </ServicesFieldModal>

                                            {/* Payments Button */}
                                            <PaymentsFieldModal
                                                payments={appointment.payments}
                                            >
                                                <button className="flex items-center gap-1 px-2 border-r-2 border-border hover:bg-primary hover:text-primary-foreground transition-colors">
                                                    <Coins className="cursor-pointer" />
                                                </button>
                                            </PaymentsFieldModal>

                                            {/* Notes Button */}
                                            <NotesFieldModal
                                                notes={appointment.notes}
                                            >
                                                <button className="flex items-center gap-1 px-2 border-r-2 border-border hover:bg-primary hover:text-primary-foreground transition-colors">
                                                    <NotebookPen className="cursor-pointer" />
                                                </button>
                                            </NotesFieldModal>

                                            {/* Diagnosis Button */}
                                            <DiagnosisFieldModal
                                                diagnosis={
                                                    appointment.diagnosis
                                                }
                                                authorName={doctorDetails.name}
                                                createdAt={
                                                    appointment.updatedAt
                                                }
                                            >
                                                <button className="flex items-center gap-1 px-2 border-r-2 border-border hover:bg-primary hover:text-primary-foreground transition-colors">
                                                    <Stethoscope className="cursor-pointer" />
                                                </button>
                                            </DiagnosisFieldModal>

                                            {/* Prescription Button */}
                                            <PrescriptionFieldModal
                                                prescription={
                                                    appointment.prescription
                                                }
                                                authorName={doctorDetails.name}
                                                createdAt={
                                                    appointment.updatedAt
                                                }
                                            >
                                                <button className="flex items-center gap-1 px-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                                                    <Pill className="cursor-pointer" />
                                                </button>
                                            </PrescriptionFieldModal>
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                                <div className="space-y-2 bg-slate rounded-[10px] p-6">
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Date:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {format(
                                                new Date(
                                                    appointment.appointmentDate
                                                ),
                                                "PP"
                                            )}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Time:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {format(
                                                new Date(
                                                    appointment.appointmentDate
                                                ),
                                                "hh:mm a"
                                            )}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Type:
                                        </span>{" "}
                                        {appointment.type}
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Status:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {appointment.status}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Duration:{" "}
                                        </span>
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {getDuration()}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold truncate overflow-hidden whitespace-nowrap">
                                            Reason for Visit:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {appointment.reasonForVisit ||
                                                "N/A"}
                                        </span>
                                    </p>

                                    {appointment.status === "CANCELLED" && (
                                        <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                            <span className="font-semibold">
                                                Cancellation Reason:
                                            </span>{" "}
                                            <span className="truncate overflow-hidden whitespace-nowrap">
                                                {appointment.cancellationReason ||
                                                    "N/A"}
                                            </span>
                                        </p>
                                    )}

                                    {appointment.status === "PENDING" && (
                                        <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                            <span className="font-semibold">
                                                Pending Reason:
                                            </span>{" "}
                                            <span className="truncate overflow-hidden whitespace-nowrap">
                                                {appointment.pendingReason ||
                                                    "N/A"}
                                            </span>
                                        </p>
                                    )}

                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Treatment:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {appointment.treatment || "N/A"}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold truncate overflow-hidden whitespace-nowrap">
                                            Consultation Fee:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {appointment.consultationFee != null
                                                ? `KES ${appointment.consultationFee.toFixed(
                                                      2
                                                  )}`
                                                : "N/A"}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Paid?
                                        </span>{" "}
                                        {appointment.isPaid ? "Yes" : "No"}
                                    </p>
                                </div>
                                <div className="space-y-2 bg-slate rounded-[10px] p-6">
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Patient:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {patientDetails.name}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Doctor:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {doctorDetails.name}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Hospital:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {hospitalDetails.name}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold truncate overflow-hidden whitespace-nowrap">
                                            Completion Status:
                                        </span>{" "}
                                        {appointment.completed ? (
                                            <span className="text-constructive flex items-center gap-1 truncate overflow-hidden whitespace-nowrap">
                                                <CheckCircle size={16} />
                                                Completed
                                            </span>
                                        ) : (
                                            <span className="text-destructive truncate overflow-hidden whitespace-nowrap">
                                                Not Completed
                                            </span>
                                        )}
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold truncate overflow-hidden whitespace-nowrap">
                                            Video Status:
                                        </span>{" "}
                                        {appointment.type === "Virtual" ? (
                                            appointment.isVideoStarted ? (
                                                <span className="text-constructive flex items-center gap-1 truncate overflow-hidden whitespace-nowrap">
                                                    <Video size={16} />
                                                    Started
                                                </span>
                                            ) : (
                                                <span className="text-destructive truncate overflow-hidden whitespace-nowrap">
                                                    Not Started
                                                </span>
                                            )
                                        ) : (
                                            "N/A"
                                        )}
                                    </p>

                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold">
                                            Created:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {format(
                                                new Date(appointment.createdAt),
                                                "PPpp"
                                            )}
                                        </span>
                                    </p>
                                    <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                        <span className="font-semibold truncate overflow-hidden whitespace-nowrap">
                                            Last Updated:
                                        </span>{" "}
                                        <span className="truncate overflow-hidden whitespace-nowrap">
                                            {format(
                                                new Date(appointment.updatedAt),
                                                "PPpp"
                                            )}
                                        </span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Doctor & Hospital Cards Container */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        {/* Doctor Card - Visible for SUPER_ADMIN, ADMIN, NURSE, STAFF */}
                        {(role === "SUPER_ADMIN" ||
                            role === "ADMIN" ||
                            role === "NURSE" ||
                            role === "STAFF") && (
                            <div className="w-full">
                                <Card className="bg-card   rounded-[10px] shadow-lg shadow-shadow-main w-full">
                                    <CardHeader className="bg-accent rounded-t-[10px] mb-2">
                                        <CardTitle className="text-[16px] flex justify-between">
                                            Doctor Details
                                            <Stethoscope />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 flex flex-col sm:flex-row gap-5 mt-8">
                                        {/* Profile */}
                                        <div className="flex flex-col items-center justify-center bg-slate rounded-[10px] p-2 w-full sm:w-[35%]">
                                            <Image
                                                src={doctorDetails.imageUrl}
                                                alt="Doctor profile"
                                                width={100}
                                                height={100}
                                                className="w-24 h-24 rounded-full object-cover border-2 border-primary mb-2"
                                            />
                                            <p className="font-medium text-md p-2 text-center">
                                                {doctorDetails.name}
                                            </p>
                                            <p className="text-sm text-center p-2 py-0">
                                                Specialization:{" "}
                                                {doctorDetails.specialization}
                                            </p>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 w-full sm:w-[65%]">
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Hospital:
                                                </span>{" "}
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {doctorDetails.hospital}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Department:
                                                </span>{" "}
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {doctorDetails.department}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Contact:
                                                </span>{" "}
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {doctorDetails.contact}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Status:
                                                </span>{" "}
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {doctorDetails.status}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Experience:
                                                </span>{" "}
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {doctorDetails.experience}{" "}
                                                    years
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Rating:
                                                </span>{" "}
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {doctorDetails.averageRating?.toFixed(
                                                        1
                                                    ) || "N/A"}
                                                    / 5
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Working Hours:
                                                </span>{" "}
                                                {doctorDetails.workingHours ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Hospital Card - Visible only for SUPER_ADMIN */}
                        {role === "SUPER_ADMIN" && (
                            <div className="w-full">
                                <Card className="bg-card   rounded-[10px] shadow-lg shadow-shadow-main w-full">
                                    <CardHeader className="bg-accent rounded-t-[10px] mb-2">
                                        <CardTitle className="text-[16px] flex justify-between">
                                            Hospital Details
                                            <Hospital />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 flex flex-col md:flex-row gap-5 mt-8 ">
                                        {/* Logo & Name */}
                                        <div className="flex flex-col items-center justify-center bg-slate rounded-[10px] p-2 w-full md:w-[35%]">
                                            <Image
                                                src={hospitalDetails.logo}
                                                alt="Hospital logo"
                                                width={100}
                                                height={100}
                                                className="w-32 h-32 object-contain mb-2 rounded-[100%] bg-primary/10 border-2 border-primary"
                                            />
                                            <p className="font-medium text-md p-2 text-center">
                                                {hospitalDetails.name}
                                            </p>
                                            <p className="text-sm text-center p-2 py-0">
                                                {hospitalDetails.level}
                                            </p>
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2 w-full md:w-[65%]">
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Hospital ID:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .hospitalId || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Facility Type:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .facilityType || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Category:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .category || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Regulatory Body:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .regulatoryBody ||
                                                        "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    NHIF Accreditation:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .nhifAccreditation ||
                                                        "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Referral Code:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .referralCode || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Open 24 Hours:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .open24Hours || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Open Weekends:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .openWeekends || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    County:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .county || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Sub-County:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .subCounty || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Ward:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .ward || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Address:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .streetAddress || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Town:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .town || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Phone:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .phone || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Emergency Phone:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .emergencyPhone ||
                                                        "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Email:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .email || "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Emergency Email:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .emergencyEmail ||
                                                        "N/A"}
                                                </span>
                                            </p>
                                            <p className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2 bg-background-muted p-2 rounded-[5px]">
                                                <span className="font-semibold">
                                                    Website:
                                                </span>
                                                <span className="truncate overflow-hidden whitespace-nowrap">
                                                    {appointment.hospital
                                                        .website ? (
                                                        <a
                                                            href={
                                                                appointment
                                                                    .hospital
                                                                    .website
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline"
                                                        >
                                                            {
                                                                appointment
                                                                    .hospital
                                                                    .website
                                                            }
                                                        </a>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </div>

    );
}