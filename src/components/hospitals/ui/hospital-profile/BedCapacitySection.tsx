// src/components/hospitals/ui/hospital-profile/BedCapacitySection.tsx

"use client";

import { BedCapacity, Role } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditBedCapacityDialog } from "./EditBedCapacityDialog";
import { useState } from "react";

interface BedCapacitySectionProps {
    bedCapacity: BedCapacity[];
    hospitalId: number;
    userRole: Role;
}

export default function BedCapacitySection({
    bedCapacity,
    hospitalId,
    userRole,
}: BedCapacitySectionProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    // If no bed capacity rows exist
    if (!bedCapacity || bedCapacity.length === 0) {
        return (
            <Card className="bg-card shadow-md rounded-[10px]">
                <CardHeader className="flex flex-row justify-between items-center bg-accent rounded-t-[10px] mb-4 p-4">
                    <CardTitle className="text-xl font-semibold">
                        Bed Capacity
                    </CardTitle>
                    {userRole === Role.SUPER_ADMIN && (
                        <Button
                            className="bg-primary text-primary-foreground rounded-[10px]"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Add Capacity
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="p-4">
                    <p>No bed capacity information available.</p>
                </CardContent>
            </Card>
        );
    }

    // Only one BedCapacity per hospital in our schema
    const capacity = bedCapacity[0];

    return (
        <Card className="bg-card shadow-md shadow-shadow-main rounded-[10px] w-full">
            <CardHeader className="flex flex-row justify-between items-center bg-accent rounded-t-[10px] mb-4 p-4">
                <CardTitle className="text-lg font-semibold">
                    Bed Capacity
                </CardTitle>
                {userRole === Role.SUPER_ADMIN && (
                    <div className="flex gap-2">
                        <Button
                            className="bg-primary text-primary-foreground rounded-[10px]"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Edit
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-3">
                <Table>
                    <TableHeader className="bg-slate text-foreground">
                        <TableRow>
                            <TableHead className="font-semibold">
                                Bed Type
                            </TableHead>
                            <TableHead className="text-right font-semibold">
                                Capacity
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Total Inpatient Beds</TableCell>
                            <TableCell className="text-right">
                                {capacity.totalInpatientBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>General Inpatient Beds</TableCell>
                            <TableCell className="text-right">
                                {capacity.generalInpatientBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Cots</TableCell>
                            <TableCell className="text-right">
                                {capacity.cots}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Maternity Beds</TableCell>
                            <TableCell className="text-right">
                                {capacity.maternityBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Emergency Casualty Beds</TableCell>
                            <TableCell className="text-right">
                                {capacity.emergencyCasualtyBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ICU Beds</TableCell>
                            <TableCell className="text-right">
                                {capacity.intensiveCareUnitBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>HDU Beds</TableCell>
                            <TableCell className="text-right">
                                {capacity.highDependencyUnitBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Isolation Beds</TableCell>
                            <TableCell className="text-right">
                                {capacity.isolationBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>General Surgical Theatres</TableCell>
                            <TableCell className="text-right">
                                {capacity.generalSurgicalTheatres || "N/A"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Maternity Surgical Theatres</TableCell>
                            <TableCell className="text-right">
                                {capacity.maternitySurgicalTheatres || "N/A"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>

            <EditBedCapacityDialog
                hospitalId={hospitalId}
                bedCapacity={capacity}
                open={isEditOpen}
                onOpen={() => setIsEditOpen(true)}
                onClose={() => setIsEditOpen(false)}
            />
        </Card>
    );
}
