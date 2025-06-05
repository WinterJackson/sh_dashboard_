// src/components/appointments/ui/appointment-modals/AddAppointmentDialog.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSessionData } from "@/hooks/useSessionData";
import { useFetchHospitals } from "@/hooks/useFetchHospitals";
import { useFetchPatientDetails } from "@/hooks/useFetchPatientDetails";
import { Doctor, Hospital, Patient, Role } from "@/lib/definitions";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { IconButton } from "@mui/material";
import { differenceInYears } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useFetchDoctorsByHospital } from "@/hooks/useFetchDoctorsByHospital";
import { useFetchDoctorIdByUserId } from "@/hooks/useFetchDoctorIdByUserId";

interface AddAppointmentDialogProps {
    open: boolean;
    onClose: () => void;
    patient?: Patient;
    doctor?: Doctor;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
    open,
    onClose,
    patient,
    doctor,
}) => {
    const { register, handleSubmit, control, setValue, setError } = useForm();
    const [saved, setSaved] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    );
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
    const [doctorFetchHospitalId, setDoctorFetchHospitalId] = useState<
        number | null
    >(null);
    const router = useRouter();
    const sessionData = useSessionData();
    const role = sessionData?.user?.role as Role;
    const hospitalId = sessionData?.user?.hospitalId;
    const userId = sessionData?.user?.id;
    const [patientName, setPatientName] = useState(
        patient?.user?.profile
            ? `${patient.user.profile.firstName} ${patient.user.profile.lastName}`
            : ""
    );

    const {
        data: fetchedPatientDetails,
        isLoading,
        isError,
    } = useFetchPatientDetails(patientName, {
        role,
        hospitalId: hospitalId ?? null,
        userId: userId ?? null,
    });

    const { data: hospitals } = useFetchHospitals({
        role,
        hospitalId: hospitalId ?? null,
        userId: userId ?? null,
    });

    useEffect(() => {
        if (role === "SUPER_ADMIN") {
            if (patient) {
                setDoctorFetchHospitalId(patient.hospitalId);
                setValue("hospitalName", patient.hospital.hospitalName);
                setValue("hospitalId", patient.hospitalId);
            } else if (fetchedPatientDetails) {
                setDoctorFetchHospitalId(fetchedPatientDetails.hospitalId);
                setValue(
                    "hospitalName",
                    fetchedPatientDetails.hospital.hospitalName
                );
                setValue("hospitalId", fetchedPatientDetails.hospitalId);
            }
        } else {
            setDoctorFetchHospitalId(hospitalId ?? null);
            if (hospitalId !== null && hospitals) {
                const hospital = hospitals.find(
                    (h) => h.hospitalId === hospitalId
                );
                setValue("hospitalName", hospital?.hospitalName || "");
                setValue("hospitalId", hospitalId);
            }
        }
    }, [role, patient, fetchedPatientDetails, hospitalId, hospitals, setValue]);

    const { data: fetchedDoctors } = useFetchDoctorsByHospital(
        doctorFetchHospitalId || -1,
        role,
        {
            role,
            hospitalId: doctorFetchHospitalId,
            userId: userId ?? null,
        }
    );

    const { data: doctorIdData } = useFetchDoctorIdByUserId(userId || "", {
        role,
        hospitalId: hospitalId ?? null,
        userId: userId ?? null,
    });

    useEffect(() => {
        if (patient) {
            const age = patient?.user?.profile?.dateOfBirth
                ? differenceInYears(
                      new Date(),
                      new Date(patient.user.profile.dateOfBirth)
                  )
                : undefined;
            setValue(
                "patientName",
                patient?.user?.profile
                    ? `${patient.user.profile.firstName} ${patient.user.profile.lastName}`
                    : "N/A"
            );
            setValue("age", age);
            setValue("patientId", patient.patientId);
            setPatientDetails(patient);
        }
    }, [patient, setValue]);

    useEffect(() => {
        if (fetchedPatientDetails && !patient) {
            const dateOfBirth =
                fetchedPatientDetails?.user?.profile?.dateOfBirth;
            if (dateOfBirth) {
                const age = differenceInYears(
                    new Date(),
                    new Date(dateOfBirth)
                );
                setValue("age", age);
            }
            setValue("patientId", fetchedPatientDetails.patientId);
            setPatientDetails(fetchedPatientDetails);
        }
    }, [fetchedPatientDetails, patient, setValue]);

    useEffect(() => {
        if (fetchedDoctors) {
            setDoctors(fetchedDoctors);
        }
    }, [fetchedDoctors]);

    useEffect(() => {
        if (role === "DOCTOR" && doctorIdData) {
            setValue("doctorId", doctorIdData.doctorId.toString());
        }
    }, [role, doctorIdData, setValue]);

    const onSubmit = async (data: any) => {
        try {
            const selectedHospitalId =
                role === "SUPER_ADMIN" ? data.hospitalId : hospitalId;
            if (!selectedHospitalId) {
                setError("hospitalId", { message: "Hospital ID is required" });
                throw new Error("Hospital ID is required");
            }
            const doctorId =
                role === "DOCTOR" && userId
                    ? doctorIdData?.doctorId
                    : data.doctorId;
            if (!doctorId && role !== "DOCTOR") {
                setError("doctorId", { message: "Doctor ID is missing" });
                throw new Error("Doctor ID is missing");
            }
            const response = await fetch(
                `${process.env.API_URL}/appointments`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...data,
                        date: selectedDate?.toISOString(),
                        hospitalId: selectedHospitalId,
                        doctorId,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to add appointment");
            }
            setSaved(true);
            router.replace("/dashboard/appointments");
        } catch (error) {
            console.error("Failed to save appointment:", error);
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Schedule Appointment</DialogTitle>
                <DialogDescription className="bg-[#EFEFEF] p-2">
                    Fill out the form below to add a new appointment.
                </DialogDescription>
                <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="patientName">Patient Name</Label>
                            <Input
                                id="patientName"
                                className="bg-[#EFEFEF]"
                                {...register("patientName", {
                                    required: "Patient name is required",
                                    onBlur: (e) =>
                                        !patient &&
                                        setPatientName(e.target.value),
                                })}
                                readOnly={!!patient}
                            />
                            {isLoading && <p>Loading...</p>}
                            {isError && (
                                <p className="text-red-500">
                                    Patient not found
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                className="bg-[#EFEFEF]"
                                {...register("age", { required: true })}
                                readOnly
                            />
                        </div>
                        <div>
                            <Label htmlFor="patientId">Patient ID</Label>
                            <Input
                                id="patientId"
                                className="bg-[#EFEFEF]"
                                {...register("patientId", { required: true })}
                                readOnly
                            />
                        </div>
                        <div className="flex gap-2">
                            <div>
                                <Label htmlFor="timeFrom">From</Label>
                                <Controller
                                    control={control}
                                    name="timeFrom"
                                    render={({ field }) => (
                                        <input
                                            type="time"
                                            {...field}
                                            className="flex bg-[#EFEFEF] h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Label htmlFor="timeTo">To</Label>
                                <Controller
                                    control={control}
                                    name="timeTo"
                                    render={({ field }) => (
                                        <input
                                            type="time"
                                            {...field}
                                            className="flex bg-[#EFEFEF] h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <div className="flex items-center rounded-[5px] bg-[#EFEFEF]">
                                <Input
                                    id="date"
                                    className="rounded-[5px] bg-white/90"
                                    value={
                                        selectedDate
                                            ? selectedDate.toLocaleDateString()
                                            : ""
                                    }
                                    readOnly
                                />
                                <IconButton
                                    onClick={() =>
                                        setIsCalendarOpen(!isCalendarOpen)
                                    }
                                >
                                    <CalendarTodayIcon />
                                </IconButton>
                            </div>
                            {isCalendarOpen && (
                                <div className="fixed z-50 bg-slate-200 mt-1">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateChange}
                                    />
                                </div>
                            )}
                        </div>

                        {(role === "SUPER_ADMIN" ||
                            role === "ADMIN" ||
                            role === "NURSE") && (
                            <div>
                                <Label htmlFor="doctorId">Doctor</Label>
                                <select
                                    id="doctorId"
                                    {...register("doctorId", {
                                        required: "Doctor is required",
                                    })}
                                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                >
                                    <option
                                        value=""
                                        className="bg-[#EFEFEF] text-gray-500"
                                    >
                                        Select a doctor
                                    </option>
                                    {doctors.map((doc: any) => (
                                        <option
                                            key={doc.doctorId}
                                            value={doc.doctorId}
                                            className="bg-white"
                                        >
                                            Dr. {doc.user.profile.firstName}{" "}
                                            {doc.user.profile.lastName} -{" "}
                                            {doc.specialization.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {role === "SUPER_ADMIN" && (
                            <div>
                                <Label htmlFor="hospitalName">Hospital</Label>
                                <select
                                    id="hospitalName"
                                    {...register("hospitalName", {
                                        required: true,
                                    })}
                                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                    disabled={!!patient}
                                >
                                    <option
                                        value=""
                                        className="bg-[#EFEFEF] text-gray-500"
                                    >
                                        Select a hospital
                                    </option>
                                    {(hospitals || []).map(
                                        (hospital: Hospital) => (
                                            <option
                                                key={hospital.hospitalName}
                                                value={hospital.hospitalName}
                                                selected={
                                                    patient?.hospitalId ===
                                                    hospital.hospitalId
                                                }
                                                className="bg-white"
                                            >
                                                {hospital.hospitalName}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        )}

                        <div>
                            <Label htmlFor="type">Appointment Type</Label>
                            <select
                                id="type"
                                {...register("type", { required: true })}
                                className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                            >
                                <option value="" disabled>
                                    Select type
                                </option>
                                <option value="Virtual">Virtual</option>
                                <option value="Walk In">Walk In</option>
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button type="submit" disabled={saved}>
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
                {saved && (
                    <div className="absolute bottom-7 bg-bluelight ml-7 p-2 rounded-[10px]">
                        <p className="text-black">Saved Successfully!</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddAppointmentDialog;
