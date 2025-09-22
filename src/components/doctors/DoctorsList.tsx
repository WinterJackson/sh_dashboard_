// src/components/doctors/DoctorsList.tsx

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Doctor, Hospital, Department, Role } from "@/lib/definitions";
import DoctorsCard from "./ui/DoctorsCard";
import DoctorsFilters from "./ui/DoctorsFilters";
import DoctorsPagination from "./ui/DoctorsPagination";

interface DoctorsListProps {
    role: Role;
    hospitalId: string | null;
    doctors: Doctor[];
    departments: Department[];
    hospitals: Hospital[];
}

const ITEMS_PER_PAGE = 10;

const DoctorsList: React.FC<DoctorsListProps> = React.memo(
    ({ role, hospitalId, doctors, hospitals, departments }) => {
        const [currentPage, setCurrentPage] = useState(1);
        const [filteredDoctors, setFilteredDoctors] = useState(doctors);

        const totalPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);

        // Update filteredDoctors only when filters change
        const onFilterChange = useCallback((newFilteredDoctors: Doctor[]) => {
            setFilteredDoctors(newFilteredDoctors);
            setCurrentPage(1); // Reset to page 1 only when filters change
        }, []);

        // Handle page change
        const handlePageChange = useCallback((newPage: number) => {
            setCurrentPage(newPage);
        }, []);

        // Paginate filteredDoctors based on currentPage
        const paginatedDoctors = useMemo(() => {
            const start = (currentPage - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            return filteredDoctors.slice(start, end);
        }, [filteredDoctors, currentPage]);

        return (
            <>
                <DoctorsFilters
                    role={role}
                    hospitalId={hospitalId}
                    doctors={doctors}
                    hospitals={hospitals}
                    departments={departments}
                    onFilterChange={onFilterChange}
                />
                <div className="flex bg-slate rounded-t-[20px] h-50 w-full p-4 pl-3">
                    <span className="font-semibold text-base text-accent-foreground">Doctor List</span>
                </div>
                <div className="bg-slate rounded-b-2xl">
                    <div className="flex flex-wrap justify-between gap-4 p-4">
                        {paginatedDoctors.map((doctor) => (
                            <DoctorsCard
                                key={doctor.doctorId}
                                doctor={doctor}
                                role={role}
                                hospitalId={hospitalId ? parseInt(hospitalId, 10) : null}
                            />
                        ))}
                    </div>
                    <DoctorsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </>
        );
    }
);

export default DoctorsList;
