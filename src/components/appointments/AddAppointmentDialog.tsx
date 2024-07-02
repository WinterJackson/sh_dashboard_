// src/components/appointments/AddAppointmentDialog.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useSearchParams, useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { fetchOnlineDoctors, fetchAllHospitals, fetchPatientDetails } from "@/lib/data";

interface AddAppointmentDialogProps {
    onClose: () => void;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({ onClose }) => {
    const { register, handleSubmit, control, setValue } = useForm();
    const [saved, setSaved] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [patientDetails, setPatientDetails] = useState<any | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchData = async () => {
            const fetchedDoctors = await fetchOnlineDoctors();
            setDoctors(fetchedDoctors);

            const fetchedHospitals = await fetchAllHospitals();
            setHospitals(fetchedHospitals);
        };

        fetchData();
    }, []);

    const fetchAndSetPatientDetails = async (name: string) => {
        const details = await fetchPatientDetails(name);
        if (details) {
            setValue("age", details.age);
            setValue("patientId", details.patientId);
            setPatientDetails(details);
        } else {
            setValue("age", "");
            setValue("patientId", "");
            setPatientDetails(null);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, date: selectedDate?.toISOString() }),
            });

            if (!response.ok) {
                throw new Error("Failed to add appointment");
            }

            const result = await response.json();
            setSaved(true);

            // Redirect to the updated appointments page
            router.replace('/dashboard/appointments');

        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("dialog");
        router.replace(`?${params.toString()}`);
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
                <DialogTitle>Add Appointment</DialogTitle>
                <DialogDescription>
                    Fill out the form below to add a new appointment.
                </DialogDescription>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4">
                        <div>
                            <Label htmlFor="patientName">Patient Name</Label>
                            <Input
                                id="patientName"
                                {...register("patientName", {
                                    required: true,
                                    onBlur: (e) => fetchAndSetPatientDetails(e.target.value)
                                })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                {...register("age", { required: true })}
                                readOnly={!!patientDetails}
                            />
                        </div>
                        <div>
                            <Label htmlFor="patientId">Patient ID</Label>
                            <Input
                                id="patientId"
                                {...register("patientId", { required: true })}
                                readOnly={!!patientDetails}
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
                                            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
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
                                            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="date">Date</Label>
                            <div className="flex items-center">
                                <Input
                                    id="date"
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
                        <div>
                            <Label htmlFor="doctorName">Doctor</Label>
                            <select
                                id="doctorName"
                                {...register("doctorName", { required: true })}
                                className="flex h-10 w-full rounded-md text-gray-500 border px-3 py-2 text-sm"
                            >
                                <option value="">Select a doctor</option>
                                {doctors.map((doctor: any) => (
                                    <option
                                        key={doctor.doctorId}
                                        value={doctor.name}
                                    >
                                        {doctor.name} - {doctor.specialization}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="hospitalName">Hospital</Label>
                            <select
                                id="hospitalName"
                                {...register("hospitalName", {
                                    required: true,
                                })}
                                className="flex h-10 w-full rounded-md text-gray-500 border px-3 py-2 text-sm"
                            >
                                <option value="">Select a hospital</option>
                                {hospitals.map((hospital: any) => (
                                    <option
                                        key={hospital.hospitalId}
                                        value={hospital.name}
                                    >
                                        {hospital.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                {...register("type", { required: true })}
                                className="flex h-10 w-full text-gray-500 rounded-md border px-3 py-2 text-sm"
                            >
                                <option value="">Select appointment type</option>
                                <option value="Virtual">Virtual</option>
                                <option value="Walk In">Walk In</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button type="submit" disabled={saved}>
                            Save
                        </Button>
                    </div>
                </form>
                <DialogClose onClick={handleClose} />
            </DialogContent>
        </Dialog>
    );
};

export default AddAppointmentDialog;
