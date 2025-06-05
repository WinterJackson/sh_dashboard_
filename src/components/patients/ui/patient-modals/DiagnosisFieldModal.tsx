// src/components/patients/patient-modals/DiagnosisFieldModal.tsx

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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DiagnosisFieldModalProps {
    diagnosis?: string | null;
    authorName?: string;
    createdAt?: string | Date;
    children?: React.ReactNode;
}

export function DiagnosisFieldModal({
    diagnosis = null,
    authorName,
    createdAt,
    children,
}: DiagnosisFieldModalProps) {
    // Determine presence
    const hasDiagnosis =
        typeof diagnosis === "string" && diagnosis.trim().length > 0;

    // Excerpt for the table cell (or trigger)
    const tableExcerpt = hasDiagnosis
        ? diagnosis.slice(0, 30) + (diagnosis.length > 30 ? "…" : "")
        : "";

    // Tooltip snippet for hover
    const tooltipSnippet = hasDiagnosis
        ? diagnosis.length > 100
            ? diagnosis.slice(0, 100) + "…"
            : diagnosis
        : "No diagnosis recorded.";

    return (
        <TooltipProvider>
            <Dialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <span
                                className={cn(
                                    "inline-block truncate max-w-[150px] cursor-pointer",
                                    hasDiagnosis
                                        ? "text-primary"
                                        : "text-gray-400"
                                )}
                                title={
                                    hasDiagnosis ? undefined : "No diagnosis"
                                }
                            >
                                {children ??
                                    (hasDiagnosis ? (
                                        tableExcerpt
                                    ) : (
                                        <em>N/A</em>
                                    ))}
                            </span>
                        </DialogTrigger>
                    </TooltipTrigger>

                    {hasDiagnosis && (
                        <TooltipContent side="top">
                            <span className="break-words">
                                {tooltipSnippet}
                            </span>
                        </TooltipContent>
                    )}
                </Tooltip>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Diagnosis Details</DialogTitle>
                        <DialogDescription>
                            Full diagnostic notes for this appointment.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-4 border rounded-md mb-4 whitespace-pre-wrap">
                        {hasDiagnosis ? (
                            diagnosis
                        ) : (
                            <p className="text-gray-500">
                                No diagnosis recorded.
                            </p>
                        )}
                    </div>

                    {hasDiagnosis && authorName && createdAt && (
                        <p className="mb-4 text-sm text-gray-600">
                            By Dr. {authorName} on{" "}
                            {format(new Date(createdAt), "PPpp")}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </TooltipProvider>
    );
}
