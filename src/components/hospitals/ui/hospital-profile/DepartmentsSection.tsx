// src/components/hospitals/ui/hospital-profile/DepartmentsSection.tsx

"use client";

import { useMemo } from "react";
import { HospitalDepartment, Role } from "@/lib/definitions";
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
import { useDeleteDepartment } from "@/hooks/useDeleteDepartment";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface DepartmentsSectionProps {
    departments: HospitalDepartment[];
    hospitalId: number;
    userRole: Role;
}

export default function DepartmentsSection({
    departments,
    hospitalId,
    userRole,
}: DepartmentsSectionProps) {
    const router = useRouter();
    const deleteDepartment = useDeleteDepartment();

    const handleViewDepartment = (departmentId: number) => {
        router.push(
            `/dashboard/hospitals/${hospitalId}/departments/${departmentId}`
        );
    };

    const handleDelete = async (departmentId: number) => {
        if (confirm("Are you sure you want to delete this department?")) {
            try {
                await deleteDepartment.mutateAsync({
                    hospitalId,
                    departmentId,
                });
            } catch (error) {
                console.error("Failed to delete department:", error);
            }
        }
    };

    // Sort departments by departmentId in ascending order
    const sortedDepartments = useMemo(() => {
        return [...departments].sort(
            (a, b) => a.department.departmentId - b.department.departmentId
        );
    }, [departments]);

    if (!departments || departments.length === 0) {
        return (
            <Card className="bg-white shadow-md rounded-[10px]">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Departments
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <p>No departments found for this hospital.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white shadow-md rounded-[10px] w-full">
            <CardHeader className="flex flex-row justify-between items-center bg-bluelight rounded-t-[10px] mb-4 p-6">
                <CardTitle className="text-xl font-semibold">
                    Departments
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <Table>
                    <TableHeader className="bg-bluelight/5">
                        <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">
                                <div className="flex items-center">
                                    Name
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="ml-1">
                                                <Info size={14} />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Hover over the department
                                                    name to see the description
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold">
                                Type
                            </TableHead>
                            <TableHead className="font-semibold whitespace-nowrap">
                                Head Of Department
                            </TableHead>
                            <TableHead className="font-semibold whitespace-nowrap">
                                Established Year
                            </TableHead>
                            <TableHead className="font-semibold">
                                <div className="flex items-center">
                                    Specializations
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="ml-1">
                                                <Info size={14} />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>
                                                    Hover to see specializations
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableHead>
                            <TableHead className="font-semibold">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedDepartments.map((deptLink) => {
                            const department = deptLink.department;
                            const specializations =
                                department.specializationLinks || [];

                            return (
                                <TableRow
                                    key={department.departmentId}
                                    className="hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <TableCell>
                                        {department.departmentId}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger className="whitespace-nowrap cursor-pointer text-center p-2 bg-white rounded-[5px]">
                                                    {department.name}
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="max-w-xs">
                                                        <span className="font-semibold">
                                                            Description:
                                                        </span>
                                                        <br />
                                                        <br />
                                                        {department.description ||
                                                            "No description available"}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>{department.type}</TableCell>
                                    <TableCell>
                                        {deptLink.headOfDepartment || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {deptLink.establishedYear || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="cursor-pointer text-center p-2 bg-white rounded-[5px] font-semibold">
                                                        {specializations.length ||
                                                            0}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className="max-w-xs">
                                                        <p className="font-semibold">
                                                            Specializations
                                                        </p>
                                                        <br />
                                                        {specializations.length >
                                                        0 ? (
                                                            <ul className="list-disc list-inside">
                                                                {specializations.map(
                                                                    (link) => (
                                                                        <li
                                                                            key={
                                                                                link
                                                                                    .specialization
                                                                                    .specializationId
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
                                                            <p className="">
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
