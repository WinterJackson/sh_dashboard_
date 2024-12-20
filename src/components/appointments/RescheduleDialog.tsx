// File: src/components/appointments/RescheduleDialog.tsx

"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSessionData } from "@/hooks/useSessionData";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { fetchOnlineDoctors } from "@/lib/data-access/doctors/data";
import { Doctor, Hospital, Role } from "@/lib/definitions";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { IconButton } from "@mui/material";
import { revalidatePath } from "next/cache";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { updateAppointmentDetails } from "@/lib/data-access/appointments/data";


interface RescheduleDialogProps {
    appointmentId: string;
    onClose: () => void;
    onRescheduleSuccess: (updatedAppointment: any) => void;
    handleActionChange: (appointmentId: string, action: string) => void;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
    appointmentId,
    onClose,
    onRescheduleSuccess,
    handleActionChange,
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

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    );
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sessionData = useSessionData();
    const userRole = sessionData?.user?.role as Role;
    const hospitalId = sessionData?.user?.hospitalId ?? null;

    // Fetch doctors and hospitals based on user role
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedDoctors = await fetchOnlineDoctors(hospitalId, userRole);

                if (userRole !== "SUPER_ADMIN" && hospitalId) {
                    const filteredDoctors = fetchedDoctors.filter(
                        (doctor: { hospitalId: number; }) => doctor.hospitalId === hospitalId
                    );
                    setDoctors(filteredDoctors);
                } else {
                    setDoctors(fetchedDoctors);
                }

                if (userRole === "SUPER_ADMIN") {
                    const fetchedHospitals = await fetchHospitals();
                    setHospitals(fetchedHospitals);
                }
            } catch (error) {
                console.error("Failed to fetch doctors or hospitals:", error);
            }
        };

        fetchData();
    }, [userRole, hospitalId]);

    // Handle doctor change to fetch associated hospital
    const handleDoctorChange = async (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const doctorId = parseInt(event.target.value, 10);
        if (userRole === "SUPER_ADMIN" && doctorId) {
            const selectedDoctor = doctors.find(
                (doctor) => doctor.doctorId === doctorId
            );
            setValue("hospitalId", selectedDoctor?.hospitalId || "");
        }
    };

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        setError(null);

        try {
            const requestBody = {
                ...data,
                date: selectedDate?.toISOString(),
                hospitalId: userRole === "SUPER_ADMIN" ? parseInt(data.hospitalId, 10) : hospitalId, // Convert to Int
                doctorId: parseInt(data.doctorId, 10),
                type: data.type,
                status: "Rescheduled",
            };

            const updatedAppointment = await updateAppointmentDetails(
                appointmentId,
                requestBody
            );

            if (!updatedAppointment) {
                throw new Error("Failed to reschedule appointment.");
            }

            setSaved(true);
            handleActionChange(appointmentId, "Rescheduled");
            onRescheduleSuccess(updatedAppointment);
            onClose();
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
            setError("Failed to reschedule appointment. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
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
                                    defaultValue=""
                                    rules={{
                                        required: "Start time is required.",
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="time"
                                            {...field}
                                            className="flex bg-[#EFEFEF] h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Label htmlFor="timeTo">To</Label>
                                <Controller
                                    control={control}
                                    name="timeTo"
                                    defaultValue=""
                                    rules={{
                                        required: "End time is required.",
                                    }}
                                    render={({ field }) => (
                                        <Input
                                            type="time"
                                            {...field}
                                            className="flex bg-[#EFEFEF] h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="doctorId">Doctor</Label>
                            <select
                                id="doctorId"
                                {...register("doctorId", {
                                    required: "Doctor is required.",
                                })}
                                className="flex h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={handleDoctorChange}
                            >
                                <option
                                    value=""
                                    className="bg-[#EFEFEF] text-gray-500"
                                >
                                    Select a doctor
                                </option>
                                {doctors.map((doctor: any) => (
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
                            {errors.doctor && (
                                <p className="text-sm p-2 text-destructive">
                                    Doctor is required.
                                </p>
                            )}
                        </div>

                        {/* Conditionally render the Hospital input only for Super Admin */}
                        {userRole === "SUPER_ADMIN" && (
                            <div>
                                <Label htmlFor="hospitalId">Hospital</Label>
                                <select
                                    id="hospitalId"
                                    {...register("hospitalId", {
                                        required: "Hospital is required.",
                                    })}
                                    className="flex h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option
                                        value=""
                                        className="bg-[#EFEFEF] text-gray-500"
                                    >
                                        Select a hospital
                                    </option>
                                    {hospitals.map((hospital: any) => (
                                        <option
                                            key={hospital.hospitalId}
                                            value={hospital.hospitalId} // Use hospitalId as the value
                                            className="bg-white"
                                        >
                                            {hospital.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.hospitalId && (
                                    <p className="text-sm p-2 text-destructive">
                                        Hospital is required.
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                {...register("type", {
                                    required: "Type is required.",
                                })}
                                className="flex h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option
                                    value=""
                                    className="bg-[#EFEFEF] text-gray-500"
                                >
                                    Select appointment type
                                </option>
                                <option value="Virtual" className="bg-white">
                                    Virtual
                                </option>
                                <option value="Walk In" className="bg-white">
                                    Walk In
                                </option>
                            </select>
                            {errors.type && (
                                <p className="text-sm p-2 text-destructive">
                                    Type is required.
                                </p>
                            )}
                        </div>
                    </div>
                    {saved && (
                        <div className="absolute bottom-11 bg-bluelight p-2 rounded-[10px]">
                            <p className=" text-black">Saved Successfully!</p>
                        </div>
                    )}
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
                <DialogClose onClick={onClose} />
            </DialogContent>
        </Dialog>
    );
};

export default RescheduleDialog;
