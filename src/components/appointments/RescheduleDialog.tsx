// src/components/appointments/RescheduleDialog.tsx

"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSessionData } from "@/hooks/useSessionData";
import { useFetchDoctorsByHospital } from "@/hooks/useFetchDoctorsByHospital";
import { useFetchHospitals } from "@/hooks/useFetchHospitals";
import { useUpdateAppointmentStatusReschedule } from "@/hooks/useUpdateAppointmentStatusReschedule";
import { useFetchAppointmentById } from "@/hooks/useFetchAppointmentById";
import { Doctor, Hospital, Role } from "@/lib/definitions";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "../ui/calendar";

interface RescheduleDialogProps {
    appointmentId: string;
    onClose: () => void;
    handleActionChange: (appointmentId: string, action: string) => void;
    updateFilteredAppointments: (updatedAppointment: any) => void;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
    appointmentId,
    onClose,
    handleActionChange,
    updateFilteredAppointments,
}) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onBlur" });
    const [saved, setSaved] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    );
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const sessionData = useSessionData();
    const role = sessionData?.user?.role as Role;
    const hospitalId = sessionData?.user?.hospitalId;
    const userId = sessionData?.user?.id;

    const { data: hospitals, isLoading: isHospitalsLoading } =
        useFetchHospitals({
            role,
            hospitalId: hospitalId ?? null,
            userId: userId ?? null,
        });

    const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
        null
    );

    // Use the useFetchAppointmentById hook to fetch appointment details
    const { data: appointmentDetails, isLoading: isAppointmentLoading } =
        useFetchAppointmentById(appointmentId, {
            role: sessionData?.user?.role as Role,
            hospitalId: sessionData?.user?.hospitalId ?? null,
            userId: sessionData?.user?.id ?? null,
        });

    // Loading states
    const [isHospitalLoading, setIsHospitalLoading] = useState<boolean>(true);
    const [isDoctorLoading, setIsDoctorLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!isAppointmentLoading && appointmentDetails) {
            // Pre-fill hospital and doctor fields for SUPER_ADMIN
            if (role === "SUPER_ADMIN") {
                setSelectedHospitalId(appointmentDetails.hospitalId); // Pre-select hospital
                setValue(
                    "hospitalId",
                    appointmentDetails.hospitalId.toString()
                );
                setValue("doctorId", appointmentDetails.doctorId.toString());
            }
            setIsHospitalLoading(false);
            setIsDoctorLoading(false);
        } else if (role === "ADMIN" || role === "NURSE") {
            // Automatically set hospital ID for ADMIN/NURSE users
            if (hospitalId !== null && hospitalId !== undefined) {
                setValue("hospitalId", hospitalId);
                fetchDoctors(hospitalId);
            }
        } else if (role === "DOCTOR") {
            // No hospital or doctor dropdown for DOCTOR users
            setValue("hospitalId", hospitalId);
            setValue("doctorId", userId);
        }
    }, [
        role,
        hospitalId,
        selectedHospitalId,
        appointmentDetails,
        isAppointmentLoading,
        setValue,
    ]);

    const { data: fetchedDoctors } = useFetchDoctorsByHospital(
        selectedHospitalId ?? hospitalId ?? -1, // Default to -1 if both are null/undefined
        role,
        {
            role,
            hospitalId: selectedHospitalId ?? hospitalId ?? null, // Default to null if both are null/undefined
            userId: userId ?? null,
        }
    );

    useEffect(() => {
        if (fetchedDoctors) {
            setDoctors(fetchedDoctors);
        }
    }, [fetchedDoctors]);

    const fetchDoctors = (hospitalId: number) => {
        if (hospitalId) {
            setSelectedHospitalId(hospitalId);
        }
    };

    const updateAppointment = useUpdateAppointmentStatusReschedule();

    const onSubmit = (data: any) => {
        if (!selectedDate) {
            console.error("Date is required.");
            return;
        }
        if (!data.timeFrom || !data.timeTo) {
            console.error("Both timeFrom and timeTo are required.");
            return;
        }

        const requestBody = {
            date: selectedDate.toISOString(),
            timeFrom: data.timeFrom,
            timeTo: data.timeTo,
            doctorId:
                role === "DOCTOR"
                    ? parseInt(userId!, 10)
                    : parseInt(data.doctorId, 10),
            hospitalId:
                role === "SUPER_ADMIN"
                    ? parseInt(data.hospitalId, 10)
                    : hospitalId!,
            type: data.type,
        };

        updateAppointment.mutate(
            {
                appointmentId,
                updateData: requestBody,
                user: sessionData?.user
                    ? {
                          role: sessionData.user.role as Role,
                          hospitalId: sessionData.user.hospitalId,
                          userId: sessionData.user.id,
                      }
                    : undefined,
            },
            {
                onSuccess: (updatedAppointment) => {
                    if (updatedAppointment) {
                        handleActionChange(appointmentId, "Rescheduled");
                        updateFilteredAppointments(updatedAppointment);
                        setSaved(true);
                        onClose();
                    }
                },
                onError: (error) => {
                    console.error(`Failed to reschedule appointment:`, error);
                },
            }
        );
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    };

    if (role === "STAFF") {
        return null; // STAFF users cannot reschedule appointments
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogDescription className="bg-[#EFEFEF] p-2">
                    Select a new date and time for the appointment and other
                    necessary details.
                </DialogDescription>
                <details
                    className="text-primary cursor-pointer pl-1 text-sm bg-primary/10 py-1 rounded-[5px]"
                    title="Click to expand and read instructions."
                >
                    <summary className="font-semibold items-center">
                        Help - Reschedule Appointment.
                    </summary>
                    <div className="absolute bg-[#E5F0FB] outline outline-1 outline-secondary/50 z-10 rounded-[10px] mt-3 mr-7 pt-4 pb-4 pr-2">
                        <p className="ml-5 text-gray-500">
                            You are required to provide the following:
                        </p>
                        <ol className="list-disc ml-10 text-gray-500 text-[13px]">
                            <li>
                                the <strong>new date</strong> of the
                                appointment.
                            </li>
                            <li>the time when the appointment should start.</li>
                            <li>the time when the appointment should end.</li>
                            <li>the doctor associated with the appointment.</li>
                            <li>
                                the hospital where the appointment should take
                                place if physical or that which is associated
                                with the appointment if virtual.
                            </li>
                            <li>
                                the type of the appointment{" "}
                                <strong>Virtual</strong> or{" "}
                                <strong>Walk In</strong>.
                            </li>
                        </ol>
                    </div>
                </details>
                <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
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
                        {role === "SUPER_ADMIN" && (
                            <div>
                                <Label htmlFor="hospitalId">Hospital</Label>
                                <select
                                    id="hospitalId"
                                    {...register("hospitalId", {
                                        required: true,
                                    })}
                                    onChange={(e) =>
                                        fetchDoctors(
                                            parseInt(e.target.value, 10)
                                        )
                                    }
                                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                >
                                    <option value="" disabled>
                                        Select a hospital
                                    </option>
                                    {(hospitals || []).map(
                                        (hospital: Hospital) => (
                                            <option
                                                key={hospital.hospitalId}
                                                value={hospital.hospitalId}
                                                selected={
                                                    appointmentDetails?.hospitalId ===
                                                    hospital.hospitalId
                                                }
                                            >
                                                {hospital.hospitalName}
                                            </option>
                                        )
                                    )}
                                </select>
                                {isHospitalLoading && <p className="text-gray-500">Loading...</p>}
                            </div>
                        )}
                        {["SUPER_ADMIN", "ADMIN", "NURSE"].includes(role) && (
                            <div>
                                <Label htmlFor="doctorId">Doctor</Label>
                                <select
                                    id="doctorId"
                                    {...register("doctorId", {
                                        required: true,
                                    })}
                                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                >
                                    <option value="" disabled>
                                        Select a doctor
                                    </option>
                                    {doctors.map((doc: Doctor) => (
                                        <option
                                            key={doc.doctorId}
                                            value={doc.doctorId}
                                        >
                                            Dr. {doc.user?.profile?.firstName}{" "}
                                            {doc.user?.profile?.lastName} -{" "}
                                            {doc.specialization.name}
                                        </option>
                                    ))}
                                </select>
                                {isDoctorLoading && <p className="text-gray-500">Loading...</p>}
                            </div>
                        )}
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
                )}{" "}
            </DialogContent>
        </Dialog>
    );
};

export default RescheduleDialog;
