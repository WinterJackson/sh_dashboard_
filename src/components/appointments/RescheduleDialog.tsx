// File: src/components/appointments/RescheduleDialog.tsx

"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useFetchHospitals } from "@/hooks/useFetchHospitals";
import { useFetchOnlineDoctors } from "@/hooks/useFetchOnlineDoctors";
import { useSessionData } from "@/hooks/useSessionData";
import { Appointment, Doctor, Hospital, Role } from "@/lib/definitions";
import { useUpdateAppointmentStatusReschedule } from "@/hooks/useUpdateAppointmentStatusReschedule";

interface RescheduleDialogProps {
    appointmentId: string;
    onClose: () => void;
    handleActionChange: (appointmentId: string, action: string) => void;
    updateFilteredAppointments: (updatedAppointment: Appointment ) => void;
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
    } = useForm({
        mode: "onBlur",
    });

    const [saved, setSaved] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    );
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    // const [doctors, setDoctors] = useState<Doctor[]>([]);

    const sessionData = useSessionData();
    const userRole = sessionData?.user?.role as Role;
    const hospitalId = sessionData?.user?.hospitalId;
    const userId = sessionData?.user?.id;

    // Use the useFetchHospitals hook
    const { data: hospitals } = useFetchHospitals({
        role: userRole,
        hospitalId: hospitalId ?? null,
        userId: userId ?? null,
    });

    // Use the useFetchOnlineDoctors hook
    const { data: doctors } = useFetchOnlineDoctors({
        role: userRole,
        hospitalId: hospitalId ?? null,
        userId: userId ?? null,
    });

    const handleDoctorChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const doctorId = parseInt(event.target.value, 10);

        if (userRole === "SUPER_ADMIN" && doctorId) {
            try {
                const selectedDoctor = doctors?.find(
                    (doctor: { doctorId: number }) =>
                        doctor.doctorId === doctorId
                );

                if (selectedDoctor) {
                    setValue("hospitalId", selectedDoctor.hospitalId);
                } else {
                    setValue("hospitalId", "");
                }
            } catch (error) {
                console.error(
                    "Failed to fetch and set doctor hospital:",
                    error
                );
            }
        }
    };

    // Mutation hook for updating the appointment
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
            doctorId: parseInt(data.doctorId, 10),
            hospitalId:
                userRole === "SUPER_ADMIN"
                    ? parseInt(data.hospitalId, 10)
                    : hospitalId!,
            type: data.type,
        };

        updateAppointment.mutate(
            { appointmentId, updateData: requestBody },
            {
                onSuccess: (updatedAppointment) => {
                    if (updatedAppointment) {
                        updateFilteredAppointments(updatedAppointment);
                        handleActionChange(appointmentId, "Rescheduled");
                        onClose();
                    } else {
                        console.error("Updated appointment is null.");
                    }
                },
            }
        );
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={true} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <button className="hidden"></button>
            </DialogTrigger>
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
                            {errors.date && (
                                <p className="text-sm text-destructive">
                                    Date is required.
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <div>
                                <Label htmlFor="timeFrom">From</Label>
                                <Controller
                                    control={control}
                                    name="timeFrom"
                                    rules={{
                                        required: "Start time is required.",
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="time"
                                            {...field}
                                            className="flex bg-[#EFEFEF] h-10  w-full border px-3 py-2 text-sm rounded-[5px]"
                                        />
                                    )}
                                />
                                {errors.timeFrom && (
                                    <p className="text-sm text-destructive">
                                        Start time is required
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="timeTo">To</Label>
                                <Controller
                                    control={control}
                                    name="timeTo"
                                    rules={{
                                        required: "End time is required.",
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="time"
                                            {...field}
                                            className="flex bg-[#EFEFEF] h-10  w-full border px-3 py-2 text-sm rounded-[5px]"
                                        />
                                    )}
                                />
                                {errors.timeTo && (
                                    <p className="text-sm text-destructive">
                                        End time is required
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="doctorId">Doctor</Label>
                            <select
                                id="doctorId"
                                {...register("doctorId", {
                                    required: "Doctor is required.",
                                })}
                                className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                onChange={handleDoctorChange}
                            >
                                <option
                                    value=""
                                    className="bg-[#EFEFEF] text-gray-500"
                                >
                                    Select a doctor
                                </option>
                                {(doctors || []).map((doctor: Doctor) => (
                                    <option
                                        key={doctor.doctorId}
                                        value={doctor.doctorId}
                                        className="bg-white"
                                    >
                                        Dr. {doctor.user.username} -{" "}
                                        {doctor.specialization?.name ||
                                            "No Specialization"}
                                    </option>
                                ))}
                            </select>
                            {errors.doctorId && (
                                <p className="text-sm text-destructive">
                                    Doctor is required.
                                </p>
                            )}
                        </div>
                        {userRole === "SUPER_ADMIN" && (
                            <div>
                                <Label htmlFor="hospitalId">Hospital</Label>
                                <select
                                    id="hospitalId"
                                    {...register("hospitalId", {
                                        required: "Hospital is required.",
                                    })}
                                    className="flex h-10 w-full border px-3 py-2 text-sm rounded-[5px]"
                                >
                                    <option
                                        value=""
                                        className="bg-[#EFEFEF] text-gray-500"
                                    >
                                        Select a hospital
                                    </option>
                                    {hospitals?.map((hospital: Hospital) => (
                                        <option
                                            key={hospital.hospitalId}
                                            value={hospital.hospitalId}
                                            className="bg-white"
                                        >
                                            {hospital.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.hospitalId && (
                                    <p className="text-sm text-destructive">
                                        Hospital is required.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={saved}
                            className="rounded-[10px]"
                        >
                            Save
                        </Button>
                    </div>
                </form>
                <DialogClose onClick={handleClose} />
            </DialogContent>
        </Dialog>
    );
};

export default RescheduleDialog;
