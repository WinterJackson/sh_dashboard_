// File: src/components/appointments/CancelDialog.tsx

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

interface CancelDialogProps {
    appointmentId: string;
    onSave: (reason: string) => Promise<void>;
    onClose: () => void;
}

const CancelDialog: React.FC<CancelDialogProps> = ({ appointmentId, onSave, onClose }) => {
    const [reason, setReason] = useState<string>("");
    const [saved, setSaved] = useState<boolean>(false);

    const handleSave = async () => {
        if (reason) {
            try {
                await onSave(reason);
                setSaved(true);
            } catch (error) {
                console.error("Error saving reason:", error);
            }
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogTrigger asChild>
                <button className="hidden"></button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Cancel Appointment</DialogTitle>
                <DialogDescription className="bg-[#EFEFEF] p-2">
                    Provide a reason for cancellation of the appointment.
                </DialogDescription>
                <textarea
                    className="w-full p-2 text-sm bg-[#EFEFEF] rounded-[5px] border h-auto ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type here..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={saved}
                />
                {saved && (
                    <div className="absolute bottom-6 bg-bluelight ml-6 p-2 rounded-[10px]">
                        <p className="text-black">Saved Successfully!</p>
                    </div>
                )}
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        onClick={handleSave}
                        className="text-white rounded-[10px]"
                        disabled={saved}
                    >
                        Save
                    </Button>
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

export default CancelDialog;
