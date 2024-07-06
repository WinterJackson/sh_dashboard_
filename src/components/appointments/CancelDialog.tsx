// File: src/components/appointments/CancelDialog.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CancelDialogProps {
    appointmentId: string;
    onSave: (reason: string) => void;
    onClose: () => void;
}

const CancelDialog: React.FC<CancelDialogProps> = ({ appointmentId, onSave, onClose }) => {
    const [reason, setReason] = useState<string>("");
    const [saved, setSaved] = useState<boolean>(false);

    const handleSave = () => {
        if (reason) {
            onSave(reason);
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
                <DialogTitle>Cancel Appointment</DialogTitle>
                <DialogDescription>Provide a reason for cancellation.</DialogDescription>
                <textarea
                    className="w-full mt-2 p-2 border rounded"
                    placeholder="Reason for cancellation"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <Button onClick={handleSave} className="text-white rounded-[10px]">Save</Button>
                </div>
                <DialogClose asChild>
                    <button className="absolute hidden top-0 right-0 m-2" onClick={onClose}></button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default CancelDialog;
