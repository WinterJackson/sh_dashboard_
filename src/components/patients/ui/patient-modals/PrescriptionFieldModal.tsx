// src/components/patients/patient-modals/PrescriptionFieldModal.tsx

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

interface PrescriptionFieldModalProps {
    prescription?: string | null;
    authorName?: string;
    createdAt?: string | Date;
    children?: React.ReactNode;
}

export function PrescriptionFieldModal({
    prescription = null,
    authorName,
    createdAt,
    children,
}: PrescriptionFieldModalProps) {
    const hasText =
        typeof prescription === "string" && prescription.trim().length > 0;

    // Table excerpt (max 30 chars)
    const tableExcerpt = hasText
        ? prescription.slice(0, 30) + (prescription.length > 30 ? "…" : "")
        : "";

    // Tooltip snippet (max 80 chars)
    const tooltipSnippet = hasText
        ? prescription.length > 80
            ? prescription.slice(0, 80) + "…"
            : prescription
        : "No prescription provided.";

    return (
        <TooltipProvider>
            <Dialog>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <span
                                className={cn(
                                    "inline-block truncate max-w-[150px] cursor-pointer",
                                    hasText ? "text-constructive" : "text-muted-foreground"
                                )}
                                title={hasText ? undefined : "No prescription"}
                            >
                                {children ??
                                    (hasText ? tableExcerpt : <em>N/A</em>)}
                            </span>
                        </DialogTrigger>
                    </TooltipTrigger>
                    {hasText && (
                        <TooltipContent side="top">
                            <span className="break-words">
                                {tooltipSnippet}
                            </span>
                        </TooltipContent>
                    )}
                </Tooltip>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Prescription Details</DialogTitle>
                        <DialogDescription>
                            Full prescription for this appointment.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-4 border rounded-md mb-4 whitespace-pre-wrap">
                        {hasText ? (
                            prescription
                        ) : (
                            <p className="text-gray-500">
                                No prescription recorded.
                            </p>
                        )}
                    </div>

                    {hasText && authorName && createdAt && (
                        <p className="mb-4 text-sm text-gray-600">
                            By {authorName} on{" "}
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
