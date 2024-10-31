// src/app/(auth)/dashboard/doctors/page.tsx

"use client";

import { useSessionData } from "@/hooks/useSessionData";
import {
    fetchAllDoctors,
    fetchDoctorsByHospital,
    fetchDepartments,
} from "@/lib/data";
import DoctorsCard from "@/components/doctors/DoctorsCard";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuSeparator,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { SymbolIcon } from "@radix-ui/react-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Doctor = {
    doctorId: number;
    user: {
        profile: {
            firstName: string;
            lastName: string;
            imageUrl?: string;
        };
        createdAt: string;
    };
    specialization: {
        name: string;
    };
    department: {
        name: string;
    };
    hospital: {
        name: string;
    };
    averageRating: number;
    status: string;
};

export default function DoctorsPage() {
    const sessionData = useSessionData();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [doctorCount, setDoctorCount] = useState(0);
    const [departments, setDepartments] = useState<string[]>([]);
    const [filterByDept, setFilterByDept] = useState<string | null>(null);
    const [filterByAvailability, setFilterByAvailability] = useState<
        string | null
    >(null);
    const [filterByDate, setFilterByDate] = useState<Date | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch doctors based on user role
    const fetchDoctors = async () => {
        if (!sessionData?.user) return;
        const { role, hospitalId } = sessionData.user;
        setIsLoading(true);

        try {
            let fetchedDoctors: Doctor[] = [];
            if (role === "SUPER_ADMIN") {
                // Fetch all doctors for SUPER_ADMIN
                fetchedDoctors = await fetchAllDoctors();
            } else if (
                ["ADMIN", "NURSE", "STAFF"].includes(role) &&
                hospitalId
            ) {
                // Fetch doctors by hospital for ADMIN, NURSE, STAFF
                fetchedDoctors = await fetchDoctorsByHospital(hospitalId);
            }

            setDoctors(fetchedDoctors);
            setDoctorCount(fetchedDoctors.length);
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Reset all filters and fetch doctors again
    const resetFilters = () => {
        setFilterByDept(null);
        setFilterByAvailability(null);
        setFilterByDate(null);
        fetchDoctors();
    };

    useEffect(() => {
        if (sessionData && sessionData.user && sessionData.user.role !== "DOCTOR") {
            fetchDoctors();
        }
    }, [sessionData]);

    if (!sessionData || !sessionData.user) {
        return (
            <div className="flex flex-wrap justify-between gap-4 mt-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        className="flex-1 min-w-auto max-w-[500px] lg:min-w-[400px] xl:w-[500px] h-[300px]"
                    />
                ))}
            </div>
        );
    }

    if (sessionData.user.role === "DOCTOR") {
        return <p>Doctors page is not available for your role.</p>;
    }

    const filterDoctors = () => {
        if (!Array.isArray(doctors)) return [];
        let filteredDoctors = [...doctors];

        if (filterByDept) {
            filteredDoctors = filteredDoctors.filter(
                (doctor) => doctor.department.name === filterByDept
            );
        }

        if (filterByAvailability) {
            filteredDoctors = filteredDoctors.filter(
                (doctor) => doctor.status === filterByAvailability
            );
        }

        if (filterByDate) {
            filteredDoctors = filteredDoctors.filter(
                (doctor) => new Date(doctor.user.createdAt) >= filterByDate
            );
        }

        return filteredDoctors;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-150px)] p-5">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-5">
                    <h1 className="text-xl font-bold">Doctors</h1>

                    <div className="flex items-center gap-3">
                        {/* Filter By Dropdown Menu */}
                        <DropdownMenu
                            onOpenChange={(isOpen) => setIsDropdownOpen(isOpen)}
                        >
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-between gap-3 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[10px] h-10 w-auto max-w-[120px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary">
                                    Filter By
                                    <ChevronRightIcon
                                        className={`ml-auto text-xl transform transition-transform duration-300 ${
                                            isDropdownOpen ? "rotate-90" : ""
                                        }`}
                                    />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="w-40 ml-16 bg-white rounded-xl p-3 mt-1">
                                {/* Department Filter */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="rounded-[5px]">
                                        Department
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent className="bg-white rounded-xl ml-5 p-2">
                                            {departments.length > 0 ? (
                                                departments.map(
                                                    (dept, index) => (
                                                        <DropdownMenuItem
                                                            key={index}
                                                            onClick={() =>
                                                                setFilterByDept(
                                                                    dept
                                                                )
                                                            }
                                                        >
                                                            {dept}
                                                        </DropdownMenuItem>
                                                    )
                                                )
                                            ) : (
                                                <DropdownMenuItem disabled>
                                                    No Departments
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>

                                <DropdownMenuSeparator />

                                {/* Availability Filter */}
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="rounded-[5px]">
                                        Availability
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent className="bg-white rounded-xl ml-5 p-2">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setFilterByAvailability(
                                                        "Online"
                                                    )
                                                }
                                                className="rounded-[5px] px-3"
                                            >
                                                Online
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    setFilterByAvailability(
                                                        "Offline"
                                                    )
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
                                        <DropdownMenuSubContent className="bg-white rounded-xl ml-5 p-2">
                                            <div className="p-2">
                                                <DatePicker
                                                    selected={filterByDate}
                                                    onChange={(date) =>
                                                        setFilterByDate(date)
                                                    }
                                                    className="p-2 border rounded-md"
                                                    placeholderText="Select Date"
                                                />
                                            </div>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Refresh Button */}
                        <button
                            className="flex items-center justify-center gap-2 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[10px] h-10 w-auto max-w-[120px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
                            onClick={resetFilters}
                        >
                            Refresh
                            <SymbolIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Conditional based on doctorCount */}
                    <p>
                        {doctorCount === 0
                            ? "There are no doctors currently registered."
                            : doctorCount === 1
                            ? "There is 1 doctor currently registered."
                            : `There are ${doctorCount} doctors currently registered.`}
                    </p>
                </div>
            </div>

            {/* Skeleton Loading, Filtered Doctors List, or No Doctors Available */}
            <div className="flex flex-wrap justify-between gap-4 mt-6">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            className="flex-1 min-w-auto max-w-[500px] lg:min-w-[400px] xl:w-[500px] h-[300px]"
                        />
                    ))
                ) : filterDoctors().length > 0 ? (
                    filterDoctors().map((doctor) => (
                        <div
                            key={doctor.doctorId}
                            className="flex-1 min-w-auto max-w-[500px] lg:min-w-[400px] xl:w-[500px]"
                        >
                            <DoctorsCard doctor={doctor} />
                        </div>
                    ))
                ) : (
                    <p className="text-center w-full text-gray-500 mt-4">
                        No doctors available
                    </p>
                )}
            </div>
        </div>
    );
}
