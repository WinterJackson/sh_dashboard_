// src/components/patients/patient-modals/PaymentsFieldModal.tsx

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
import { Payment } from "@/lib/definitions";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaymentsFieldModalProps {
    payments?: Payment[];
    children: React.ReactNode;
}

export function PaymentsFieldModal({
    payments = [],
    children,
}: PaymentsFieldModalProps) {
    const hasPayments = payments.length > 0;

    const excerpt = payments.slice(0, 3).map((payment, index) => (
        <span key={index}>
            {payment.service?.serviceName}
            {index < Math.min(payments.length, 3) - 1 ? ", " : ""}
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
                                    hasPayments
                                        ? "text-primary"
                                        : "text-gray-400"
                                )}
                                title={
                                    hasPayments ? undefined : "No payments"
                                }
                            >
                                {children}
                            </span>
                        </DialogTrigger>
                    </TooltipTrigger>
                    {hasPayments && (
                        <TooltipContent side="bottom" className="bg-slate-100 text-black mt-1">
                            <div className="space-x-1 truncate">{excerpt}</div>
                        </TooltipContent>
                    )}
                </Tooltip>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Appointment Payments</DialogTitle>
                        <DialogDescription>
                            All payments recorded for this appointment.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
                        {hasPayments ? (
                            payments.map((payment) => (
                                <div
                                    key={`${payment.appointmentId}-${payment.paymentId}`}
                                    className="p-3 border rounded-lg"
                                >
                                    <ul className="space-y-1 text-sm">
                                        <li>
                                            <span className="font-medium">
                                                Service:
                                            </span>{" "}
                                            {payment.service?.serviceName ||
                                                "N/A"}
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Amount:
                                            </span>{" "}
                                            {payment.amount != null
                                                ? `KES ${payment.amount.toFixed(
                                                      2
                                                  )}`
                                                : "N/A"}
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Hospital:
                                            </span>{" "}
                                            {payment.hospital?.hospitalName ||
                                                "N/A"}
                                        </li>
                                        <li>
                                            <span className="font-medium">
                                                Paid On:
                                            </span>{" "}
                                            {payment.createdAt
                                                ? format(
                                                      new Date(
                                                          payment.createdAt
                                                      ),
                                                      "dd MMM yyyy, hh:mm a"
                                                  )
                                                : "N/A"}
                                        </li>
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">
                                No payments recorded.
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
