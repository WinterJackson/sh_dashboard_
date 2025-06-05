// src/components/hospitals/ui/hospital-profile/BedCapacitySection.tsx

"use client";

import { Hospital } from "@/lib/definitions";
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
import { useSession } from "next-auth/react";
import { Role } from "@/lib/definitions";
import { EditBedCapacityDialog } from "./EditBedCapacityDialog";
import { useState } from "react";

export default function BedCapacitySection({
    hospital,
}: {
    hospital: Hospital;
}) {
    const { data: session } = useSession();
    const userRole = session?.user?.role as Role;
    const [isEditOpen, setIsEditOpen] = useState(false);

    if (!hospital.bedCapacity || hospital.bedCapacity.length === 0) {
        return (
            <Card className="bg-white shadow-md rounded-[10px]">
                <CardHeader className="flex flex-row justify-between items-center bg-bluelight rounded-t-[10px] mb-4">
                    <CardTitle className="text-xl font-semibold">
                        Bed Capacity
                    </CardTitle>
                    {userRole === Role.SUPER_ADMIN && (
                        <Button
                            className="bg-primary text-white rounded-[10px]"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Add Capacity
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <p>No bed capacity information available.</p>
                </CardContent>
            </Card>
        );
    }

    const bedCapacity = hospital.bedCapacity[0];

    return (
        <Card className="bg-white shadow-md rounded-[10px] w-full">
                <CardHeader className="flex flex-row justify-between items-center bg-bluelight rounded-t-[10px] mb-4">
                <CardTitle className="text-lg font-semibold">
                    Bed Capacity
                </CardTitle>
                {userRole === Role.SUPER_ADMIN && (
                    <div className="flex gap-2">
                        <Button
                            className="bg-primary text-white rounded-[10px]"
                            onClick={() => setIsEditOpen(true)}
                        >
                            Edit
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="p-3">
                <Table>
                    <TableHeader className="bg-black/5">
                        <TableRow>
                            <TableHead className="font-semibold">Bed Type</TableHead>
                            <TableHead className="text-right font-semibold">Capacity</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Total Inpatient Beds</TableCell>
                            <TableCell className="text-right">
                                {bedCapacity.totalInpatientBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>General Inpatient Beds</TableCell>
                            <TableCell className="text-right">
                                {bedCapacity.generalInpatientBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Cots</TableCell>
                            <TableCell className="text-right">{bedCapacity.cots}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Maternity Beds</TableCell>
                            <TableCell className="text-right">{bedCapacity.maternityBeds}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Emergency Casualty Beds</TableCell>
                            <TableCell className="text-right">
                                {bedCapacity.emergencyCasualtyBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ICU Beds</TableCell>
                            <TableCell className="text-right">
                                {bedCapacity.intensiveCareUnitBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>HDU Beds</TableCell>
                            <TableCell className="text-right">
                                {bedCapacity.highDependencyUnitBeds}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Isolation Beds</TableCell>
                            <TableCell className="text-right">{bedCapacity.isolationBeds}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>General Surgical Theatres</TableCell>
                            <TableCell className="text-right">
                                {bedCapacity.generalSurgicalTheatres || "N/A"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Maternity Surgical Theatres</TableCell>
                            <TableCell className="text-right">
                                {bedCapacity.maternitySurgicalTheatres || "N/A"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>

            <EditBedCapacityDialog
                hospitalId={hospital.hospitalId}
                bedCapacity={bedCapacity}
                open={isEditOpen}
                onOpen={() => setIsEditOpen(true)}
                onClose={() => setIsEditOpen(false)}
            />
        </Card>
    );
}
