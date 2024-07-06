// src/components/referral/ReferPatientDialog.tsx

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
import { useRouter } from "next/navigation";
import { IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { fetchAllHospitals, fetchPatientDetails } from "@/lib/data";

interface ReferPatientDialogProps {
    onClose: () => void;
}

const ReferPatientDialog: React.FC<ReferPatientDialogProps> = ({ onClose }) => {
    const { register, handleSubmit, control, setValue } = useForm();
    const [saved, setSaved] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    const [patientDetails, setPatientDetails] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const fetchedHospitals = await fetchAllHospitals();
            setHospitals(fetchedHospitals);
        };

        fetchData();
    }, []);

    const fetchAndSetPatientDetails = async (name: string) => {
        const details = await fetchPatientDetails(name);
        if (details) {
            setValue("patientId", details.patientId);
            setPatientDetails(details);
        } else {
            setValue("patientId", "");
            setPatientDetails(null);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch("/api/referrals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...data, date: selectedDate?.toISOString() }),
            });

            if (!response.ok) {
                throw new Error("Failed to refer patient");
            }

            const result = await response.json();
            setSaved(true);

            // Redirect to the updated referrals page
            router.replace('/dashboard/referrals');

        } catch (error) {
            console.error(error);
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
                <DialogTitle>Patient Referral Form</DialogTitle>
                <DialogDescription>
                    Fill out the form below to refer a patient.
                </DialogDescription>
                <form className="p-1" onSubmit={handleSubmit(onSubmit)}>
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
                            <Label htmlFor="patientId">Patient ID</Label>
                            <Input
                                id="patientId"
                                {...register("patientId", { required: true })}
                                readOnly={!!patientDetails}
                            />
                        </div>
                        <div>
                            <Label htmlFor="hospitalName">Recommended Hospital</Label>
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
                            <Label htmlFor="type">Type</Label>
                            <select
                                id="type"
                                {...register("type", { required: true })}
                                className="flex h-10 w-full text-gray-500 rounded-md border px-3 py-2 text-sm"
                            >
                                <option value="">Select referral type</option>
                                <option value="Internal">Internal</option>
                                <option value="External">External</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button type="submit" disabled={saved} className="rounded-[10px]">
                            Save
                        </Button>
                    </div>
                </form>
                <DialogClose onClick={handleClose} />
            </DialogContent>
        </Dialog>
    );
};

export default ReferPatientDialog;
