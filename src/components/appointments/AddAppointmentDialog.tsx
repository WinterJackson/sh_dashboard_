// src/components/appointments/AddAppointmentDialog.tsx

"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { DatePicker } from "@/components/appointments/DatePicker";

interface AddAppointmentDialogProps {
    onClose: () => void;
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({ onClose }) => {
    const { register, handleSubmit, control } = useForm();
    const [saved, setSaved] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const router = useRouter();
    const searchParams = useSearchParams();

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to add appointment");
            }

            setSaved(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("dialog");
        router.push(`?${params.toString()}`);
        onClose();
    };

    const handleDateChange = (date: Date | undefined) => {
        setSelectedDate(date);
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
                            <Label htmlFor="patientName">Patient's Name</Label>
                            <Input
                                id="patientName"
                                {...register("patientName", { required: true })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                {...register("age", { required: true })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="patientId">Patient ID</Label>
                            <Input
                                id="patientId"
                                {...register("patientId", { required: true })}
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
                            <Controller
                                control={control}
                                name="date"
                                render={({ field }) => (
                                    <DatePicker
                                        onDateChange={(date) => {
                                            field.onChange(date);
                                            handleDateChange(date);
                                        }}
                                    />
                                )}
                            />
                        </div>
                        {selectedDate && (
                            <div className="text-sm text-gray-600">
                                Selected Date: <span className="font-bold">{selectedDate.toLocaleDateString()}</span>
                            </div>
                        )}
                        <div>
                            <Label htmlFor="doctorName">Doctor's Name</Label>
                            <Input
                                id="doctorName"
                                {...register("doctorName", { required: true })}
                            />
                        </div>
                        <div>
                            <Label htmlFor="type">Type</Label>
                            <Input
                                id="type"
                                {...register("type", { required: true })}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-4">
                        <Button type="button" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Add New</Button>
                    </div>
                    {saved && <p className="text-green-500 mt-2">Saved</p>}
                </form>
                <DialogClose asChild>
                    <button
                        className="absolute top-0 right-0 m-2"
                        onClick={handleClose}
                    ></button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default AddAppointmentDialog;
