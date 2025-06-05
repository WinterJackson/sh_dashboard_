// src/components/hospitals/ui/hospital-profile/DepartmentsSection.tsx

"use client";

import { Hospital, Department } from "@/lib/definitions";
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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Role } from "@/lib/definitions";
import { useDeleteDepartment } from "@/hooks/useDeleteDepartment";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default function DepartmentsSection({
    hospital,
}: {
    hospital: Hospital;
}) {
    const router = useRouter();
    const { data: session } = useSession();
    const userRole = session?.user?.role as Role;
    const deleteDepartment = useDeleteDepartment();

    const handleViewDepartment = (departmentId: number) => {
        router.push(
            `/dashboard/hospitals/${hospital.hospitalId}/departments/${departmentId}`
        );
    };

    const handleDelete = async (departmentId: number) => {
        if (confirm("Are you sure you want to delete this department?")) {
            try {
                await deleteDepartment.mutateAsync({
                    hospitalId: hospital.hospitalId,
                    departmentId,
                });
            } catch (error) {
                console.error("Failed to delete department:", error);
            }
        }
    };

    if (!hospital.departments || hospital.departments.length === 0) {
        return (
            <Card className="bg-white shadow-md rounded-[10px]">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Departments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>No departments found for this hospital.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white shadow-md rounded-[10px] w-full">
                <CardHeader className="flex flex-row justify-between items-center bg-bluelight rounded-t-[10px] mb-4">
                <CardTitle className="text-xl font-semibold">
                    Departments
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader className="bg-bluelight/5">
                        <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">Description</TableHead>
                            <TableHead className="font-semibold">Head</TableHead>
                            <TableHead className="font-semibold">Location</TableHead>
                            <TableHead className="font-semibold">Established</TableHead>
                            <TableHead className="font-semibold">
                                <div className="flex items-center">
                                    Specializations
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="ml-1">
                                                <Info size={14} />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Hover to see specializations</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {hospital.departments.map((deptLink) => {
                            const department = deptLink.department;
                            const specializations = department.specializationLinks || [];
                            
                            return (
                                <TableRow key={department.departmentId}>
                                    <TableCell>
                                        {department.departmentId}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {department.name}
                                    </TableCell>
                                    <TableCell>{department.type}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {department.description ||
                                                        "N/A"}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">
                                                        {department.description ||
                                                            "No description"}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>
                                        {deptLink.headOfDepartment || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {deptLink.location || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {deptLink.establishedYear || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    {specializations.length ||
                                                        0}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="max-w-xs">
                                                        <p className="font-semibold">
                                                            List of
                                                            Specializations
                                                        </p>
                                                        {specializations.length >
                                                        0 ? (
                                                            <ul className="list-disc list-inside mt-1">
                                                                {specializations.map(
                                                                    (link) => (
                                                                        <li
                                                                            key={
                                                                                link.specializationId
                                                                            }
                                                                        >
                                                                            {
                                                                                link
                                                                                    .specialization
                                                                                    ?.name
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <p className="mt-1">
                                                                No
                                                                specializations
                                                            </p>
                                                        )}
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="bg-primary text-white rounded-[10px]"
                                                onClick={() =>
                                                    handleViewDepartment(
                                                        department.departmentId
                                                    )
                                                }
                                            >
                                                View
                                            </Button>
                                            {userRole === Role.ADMIN && (
                                                <Button
                                                    size="sm"
                                                    className="bg-red-500 text-white rounded-[10px]"
                                                    onClick={() =>
                                                        handleDelete(
                                                            department.departmentId
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}