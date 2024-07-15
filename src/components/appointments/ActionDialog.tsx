// File: src/components/appointments/ActionDialog.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ActionDialogProps {
    appointmentId: string;
    action: "Pending";
    onSave: (reason: string) => void;
    onClose: () => void;
}

const ActionDialog: React.FC<ActionDialogProps> = ({ appointmentId, action, onSave, onClose }) => {
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
                <DialogTitle>Set Appointment to Pending</DialogTitle>
                <DialogDescription className="bg-[#EFEFEF] p-2">
                    Provide a reason for setting the appointment to pending.
                </DialogDescription>
                <textarea
                    className="w-full p-2 text-sm bg-[#EFEFEF] rounded-[5px] border h-auto ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Type here..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-4">
                    <Button
                        onClick={handleSave}
                        className="text-white rounded-[10px]"
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

export default ActionDialog;
