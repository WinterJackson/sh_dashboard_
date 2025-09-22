// src/components/doctors/ui/DoctorsFilters.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Doctor, Hospital, Department, Role } from "@/lib/definitions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, CircleX as CancelledIcon } from "lucide-react";
import { SymbolIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";

interface DoctorsFiltersProps {
    role: Role;
    hospitalId: string | null;
    doctors: Doctor[];
    hospitals: Hospital[];
    departments: Department[];
    onFilterChange: (filteredDoctors: Doctor[]) => void;
}

const DoctorsFilters: React.FC<DoctorsFiltersProps> = ({
    role,
    hospitalId,
    doctors,
    hospitals,
    departments,
    onFilterChange,
}) => {
    const [filters, setFilters] = useState({
        department: "",
        availability: "",
        dateJoined: undefined as Date | undefined,
        hospital: "",
    });

    const userRole = role;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Memoized filtered doctors
    const filteredDoctors = useMemo(() => {
        return doctors.filter((doctor) => {
            const { department, availability, dateJoined, hospital } = filters;

            const matchesDepartment = department
                ? doctor.department.name === department
                : true;
            const matchesAvailability = availability
                ? doctor.status === availability
                : true;
            const matchesDateJoined = dateJoined
                ? new Date(doctor.user.createdAt).toDateString() ===
                  dateJoined.toDateString()
                : true;
            const matchesHospital = hospital
                ? doctor.hospital.hospitalName === hospital
                : true;

            return (
                matchesDepartment &&
                matchesAvailability &&
                matchesDateJoined &&
                matchesHospital
            );
        });
    }, [doctors, filters]);

    // Trigger onFilterChange callback with memoized filtered doctors
    useEffect(() => {
        onFilterChange(filteredDoctors);
    }, [filteredDoctors, onFilterChange]);

    const handleFilterRemove = (filterKey: keyof typeof filters) => {
        setFilters((prev) => ({
            ...prev,
            [filterKey]: filterKey === "dateJoined" ? undefined : "",
        }));
    };

    const resetFilters = () => {
        setFilters({
            department: "",
            availability: "",
            dateJoined: undefined,
            hospital: "",
        });
    };

    return (
        <div className="flex flex-col min-w-full">
            <div className="flex items-center gap-4">
                {/* Refresh Button */}
                <button
                    className="flex items-center justify-center gap-2 p-3 mt-2 hover:shadow-shadow-main shadow-md shadow-shadow-main text-foreground hover:bg-primary hover:text-primary-foreground rounded-[10px] h-[50px] w-auto max-w-[120px] focus:outline-none focus:ring-1 focus:ring-primary"
                    onClick={resetFilters}
                >
                    Refresh
                    <SymbolIcon className="w-5 h-5" />
                </button>

                {/* Active Tags */}
                <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(
                        ([key, value]) =>
                            value && (
                                <div
                                    key={key}
                                    className="bg-light-accent text-accent-foreground p-2 mt-2 rounded-[10px] h-[40px] w-auto gap-2 hover:shadow-shadow-main shadow-md shadow-shadow-main hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-center"
                                >
                                    <span className="font-normal text-sm">{`${
                                        key === "dateJoined" &&
                                        value instanceof Date
                                            ? value.toLocaleDateString()
                                            : value
                                    }`}</span>
                                    <button
                                        onClick={() =>
                                            handleFilterRemove(
                                                key as keyof typeof filters
                                            )
                                        }
                                        className="flex items-center justify-center p-[2px] bg-background rounded-full"
                                    >
                                        <CancelledIcon className="h-5 w-5 text-center text-red-500 hover:text-white hover:bg-red-500 rounded-full" />
                                    </button>
                                </div>
                            )
                    )}
                </div>
            </div>

            <div className="p-2 pt-0 pl-0 flex flex-row justify-between items-center mt-2">
                {/* Filter By Dropdown Menu */}
                <DropdownMenu
                    onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}
                >
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center justify-between gap-3 p-3 hover:shadow-shadow-main shadow-md shadow-shadow-main rounded-[10px] h-[50px] w-[170px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                            Filter By
                            <ChevronRight
                                className={`ml-auto text-xl transform transition-transform duration-300 ${
                                    isDropdownOpen ? "rotate-90" : ""
                                }`}
                            />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40 ml-1 bg-background rounded-[10px] p-2 mt-1">
                        {/* Department Filter */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="rounded-[5px]">
                                Department
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background rounded-[10px] ml-3 p-2 max-h-60 overflow-y-auto scrollbar-custom">
                                    {departments.length > 0 ? (
                                        departments.map((dept) => (
                                            <DropdownMenuItem
                                                key={dept.departmentId}
                                                onClick={() =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        department: dept.name,
                                                    }))
                                                }
                                                className="rounded-[5px]"
                                            >
                                                {dept.name}
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <DropdownMenuItem disabled>
                                            No Departments
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />

                        {/* Hospital Filter (Visible Only to SUPER_ADMIN) */}
                        {userRole === "SUPER_ADMIN" && (
                            <>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="rounded-[5px]">
                                        Hospital
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent className="bg-background rounded-[10px] ml-3 p-2 max-h-60 overflow-y-auto scrollbar-custom">
                                            {hospitals.length > 0 ? (
                                                hospitals.map((hospital) => (
                                                    <DropdownMenuItem
                                                        key={
                                                            hospital.hospitalId
                                                        }
                                                        onClick={() =>
                                                            setFilters(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    hospital:
                                                                        hospital.hospitalName,
                                                                })
                                                            )
                                                        }
                                                        className="rounded-[5px]"
                                                    >
                                                        {hospital.hospitalName}
                                                    </DropdownMenuItem>
                                                ))
                                            ) : (
                                                <DropdownMenuItem disabled>
                                                    No Hospitals
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuSeparator />
                            </>
                        )}

                        {/* Availability Filter */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="rounded-[5px]">
                                Availability
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background rounded-[10px] ml-3 p-2">
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                availability: "Online",
                                            }))
                                        }
                                        className="rounded-[5px] px-3"
                                    >
                                        Online
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                availability: "Offline",
                                            }))
                                        }
                                        className="rounded-[5px] px-3"
                                    >
                                        Offline
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />

                        {/* Date Filter */}
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="rounded-[5px]">
                                Date Joined
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background rounded-[10px] ml-3 p-2">
                                    <Calendar
                                        mode="single"
                                        selected={filters.dateJoined}
                                        onSelect={(date) =>
                                            setFilters((prev) => ({
                                                ...prev,
                                                dateJoined: date,
                                            }))
                                        }
                                        initialFocus
                                    />
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default DoctorsFilters;
