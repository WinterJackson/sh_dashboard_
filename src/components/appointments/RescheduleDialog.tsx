// src/components/appointments/RescheduleDialog.tsx

"use client";

import React, { useState, useEffect } from "react";
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
import { fetchOnlineDoctors, fetchAllHospitals } from "@/lib/data";
import { revalidatePath } from "next/cache";

interface RescheduleDialogProps {
    appointmentId: string;
    onClose: () => void;
    handleActionChange: (appointmentId: string, action: string) => void; // New prop
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({
    appointmentId,
    onClose,
    handleActionChange,
}) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        mode: "onBlur", // Validate on blur to provide feedback as user types
    });
    const [saved, setSaved] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    );
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedDoctors = await fetchOnlineDoctors();
            setDoctors(fetchedDoctors);

            const fetchedHospitals = await fetchAllHospitals();
            setHospitals(fetchedHospitals);
        };

        fetchData();
    }, []);

    const onSubmit = async (data: any) => {
        handleActionChange(appointmentId, "Rescheduled");

        try {
            const response = await fetch(`/api/appointments/${appointmentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    date: selectedDate?.toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to reschedule appointment");
            }

            console.log("Appointment rescheduled successfully");
            setSaved(true);
            revalidatePath("/dashboard/appointments");

            onClose();
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
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
                            <Label htmlFor="doctor">Doctor</Label>
                            <select
                                id="doctor"
                                {...register("doctor", {
                                    required: "Doctor is required.",
                                })}
                                className="flex h-10  w-full border px-3 py-2 text-sm rounded-[5px] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                                        value={doctor.name}
                                        className="bg-white"
                                    >
                                        {doctor.name} - {doctor.specialization}
                                    </option>
                                ))}
                            </select>
                            {errors.doctor && (
                                <p className="text-sm p-2 text-destructive">
                                    Doctor is required.
                                </p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="hospital">Hospital</Label>
                            <select
                                id="hospital"
                                {...register("hospital", {
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
                                        value={hospital.name}
                                        className="bg-white"
                                    >
                                        {hospital.name}
                                    </option>
                                ))}
                            </select>
                            {errors.hospital && (
                                <p className="text-sm p-2 text-destructive">
                                    Hospital is required.
                                </p>
                            )}
                        </div>
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
