// src/components/patients/patient-modals/NotesFieldModal.tsx

"use client";

import * as React from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { AppointmentNote } from "@/lib/definitions";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotesFieldModalProps {
    notes?: AppointmentNote[];
    children: React.ReactNode;
}

export function NotesFieldModal({
    notes = [],
    children,
}: NotesFieldModalProps) {
    const hasNotes = notes.length > 0;
    const excerpt = notes.slice(0, 3).map((note) => (
        <div key={note.appointmentNoteId} className="mb-2">
            <p className="text-md italic truncate">
                "{note.content.slice(0, 50)}
                {note.content.length > 50 ? "..." : ""}"
            </p>
            <p className="text-[12px] text-gray-600">
                {note.author.profile?.firstName} {note.author.profile?.lastName}{" "}
                · {format(new Date(note.createdAt), "dd MMM yyyy, hh:mm a")}
            </p>
        </div>
    ));

    return (
        <TooltipProvider>
            <Dialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <span
                                className={cn(
                                    "inline-block truncate cursor-pointer",
                                    hasNotes ? "text-constructive" : "text-muted-foreground"
                                )}
                            >
                                {children}
                            </span>
                        </DialogTrigger>
                    </TooltipTrigger>
                    {hasNotes && (
                        <TooltipContent side="bottom" className="bg-slate-100 text-black mt-1">
                            {excerpt}
                        </TooltipContent>
                    )}
                </Tooltip>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Appointment Notes</DialogTitle>
                        <DialogDescription>
                            List of notes recorded for this appointment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
                        {hasNotes ? (
                            notes.map((note) => (
                                <div
                                    key={note.appointmentNoteId}
                                    className="p-3 border rounded-lg"
                                >
                                    <p className="text-md mb-1">
                                        {note.content}
                                    </p>
                                    <p className="text-[12px] text-gray-600">
                                        By {note.author.profile?.firstName}{" "}
                                        {note.author.profile?.lastName} on{" "}
                                        {format(
                                            new Date(note.createdAt),
                                            "PPpp"
                                        )}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No notes available.
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
