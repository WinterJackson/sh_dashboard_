// File: src/components/appointments/RescheduleDialog.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { DatePicker } from "@/components/appointments/DatePicker";
import { Button } from "@/components/ui/button";

interface RescheduleDialogProps {
    appointmentId: string;
    onSave: (date: Date, reason: string) => void;
    onClose: () => void;
}

const RescheduleDialog: React.FC<RescheduleDialogProps> = ({ appointmentId, onSave, onClose }) => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [reason, setReason] = useState<string>("");
    const [saved, setSaved] = useState<boolean>(false);

    const handleSave = () => {
        if (date && reason) {
            onSave(date, reason);
            setSaved(true);
        }
    };

    useEffect(() => {
        if (saved) {
            const timer = setTimeout(() => {
                onClose();
                setSaved(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [saved, onClose]);

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button className="hidden"></button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogDescription>
                    Select a new date for the appointment and provide a reason.
                </DialogDescription>
                <DatePicker onDateChange={setDate} />
                <textarea
                    className="w-full mt-2 p-2 border rounded"
                    placeholder="Reason for rescheduling"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex justify-center gap-2 mt-4">
                    <Button
                        onClick={handleSave}
                        className="text-white rounded-sm"
                    >
                        Save
                    </Button>
                    {saved && (
                        <p className="text-white bg-primary p-2 rounded-sm">
                            Saved
                        </p>
                    )}
                </div>
                <DialogClose asChild>
                    <button
                        className="absolute hidden top-0 right-0 m-2"
                        onClick={onClose}
                    ></button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default RescheduleDialog;
