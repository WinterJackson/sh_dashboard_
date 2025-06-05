// src/components/appointments/ui/appointment-modals/PendingDialog.tsx

"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { updateAppointmentStatus } from "@/lib/data-access/appointments/data";

interface PendingDialogProps {
    appointmentId: string;
    onSave: (reason: string) => Promise<void>;
    onClose: () => void;
    handleActionChange: (appointmentId: string, action: string) => void;
}

const PendingDialog: React.FC<PendingDialogProps> = ({
    appointmentId,
    onSave,
    onClose,
    handleActionChange,
}) => {
    const [reason, setReason] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!reason.trim()) {
            setError("Reason is required for marking as pending.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await onSave(reason);
            handleActionChange(appointmentId, "Pending");
            setIsSuccess(true);
            setTimeout(onClose, 2000);
        } catch (err) {
            console.error("Error marking appointment as pending:", err);
            setError("Failed to update the appointment status. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button className="hidden"></button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Set Appointment to Pending</DialogTitle>
                <DialogDescription className="bg-[#EFEFEF] p-2">
                    Provide a reason for setting the appointment to pending.
                </DialogDescription>
                <textarea
                    className="w-full p-2 text-sm bg-[#EFEFEF] rounded-[5px] border h-auto ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type your reason here..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isSaving || isSuccess}
                />
                {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                )}
                {isSuccess && (
                    <div className="absolute bottom-6 bg-green-100 text-green-700 ml-6 p-2 rounded-[10px]">
                        <p>Saved Successfully!</p>
                    </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        onClick={handleSave}
                        className="text-white rounded-[10px]"
                        disabled={isSaving || isSuccess}
                    >
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                    <DialogClose asChild>
                        <Button
                            className="text-gray-700 rounded-[10px] bg-gray-100"
                            onClick={onClose}
                            disabled={isSaving}
                        >
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PendingDialog;
