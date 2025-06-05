// src/components/patients/patient-modals/ServicesFieldModal.tsx

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
import { AppointmentService } from "@/lib/definitions";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ServicesFieldModalProps {
    services?: AppointmentService[];
    children: React.ReactNode;
}

export function ServicesFieldModal({
    services = [],
    children,
}: ServicesFieldModalProps) {
    const hasServices = services.length > 0;

    const excerpt = services.slice(0, 3).map((svc, i) => (
        <span key={i}>
            {svc.service?.serviceName}
            {i < Math.min(services.length, 3) - 1 ? ", " : ""}
        </span>
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
                                    hasServices ? "text-primary" : "text-gray-400"
                                )}
                            >
                                {children}
                            </span>
                        </DialogTrigger>
                    </TooltipTrigger>
                    {hasServices && (
                        <TooltipContent side="bottom" className="bg-slate-100 text-black mt-1">
                            <div className="space-x-1 truncate">{excerpt}</div>
                        </TooltipContent>
                    )}
                </Tooltip>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Appointment Services</DialogTitle>
                        <DialogDescription>
                            All services provided on this appointment.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
                        {hasServices ? (
                            services.map((svc) => {
                                // const meta = svc.service?.hospitalServices?.[0];
                                return (
                                    <div
                                        key={`${svc.appointmentId}-${svc.serviceId}`}
                                        className="p-3 border rounded-lg"
                                    >
                                        <ul className="space-y-1 text-sm">
                                            <li>
                                                <span className="font-medium">Name:</span>{" "}
                                                {svc.service?.serviceName || "N/A"}
                                            </li>
                                            <li className="capitalize">
                                                <span className="font-medium">Type:</span>{" "}
                                                {svc.service?.type?.toLowerCase().replace("_", " ") || "N/A"}
                                            </li>
                                            <li>
                                                <span className="font-medium">Hospital:</span>{" "}
                                                {svc.hospital?.hospitalName || "N/A"}
                                            </li>
                                            <li>
                                                <span className="font-medium">Department:</span>{" "}
                                                {svc.department?.name || "N/A"}
                                            </li>
                                            {/* <li>
                                                <span className="font-medium">Price:</span>{" "}
                                                {meta?.basePrice != null
                                                    ? `KES ${meta.basePrice.toFixed(2)}`
                                                    : "N/A"}
                                            </li>
                                            <li>
                                                <span className="font-medium">Discount:</span>{" "}
                                                {meta?.discount != null
                                                    ? `${meta.discount}%`
                                                    : "N/A"}
                                            </li>
                                            <li>
                                                <span className="font-medium">Duration:</span>{" "}
                                                {meta?.duration != null
                                                    ? `${meta.duration} mins`
                                                    : "N/A"}
                                            </li>
                                            <li>
                                                <span className="font-medium">Walk-in Allowed:</span>{" "}
                                                {meta?.isWalkInAllowed ? "Yes" : "No"}
                                            </li>
                                            <li>
                                                <span className="font-medium">Requires Referral:</span>{" "}
                                                {meta?.requiresReferral ? "Yes" : "No"}
                                            </li> */}
                                            <li>
                                                <span className="font-medium">Added:</span>{" "}
                                                {format(new Date(svc.createdAt), "dd MMM yyyy, hh:mm a")}
                                            </li>
                                        </ul>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500">No services recorded.</p>
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
