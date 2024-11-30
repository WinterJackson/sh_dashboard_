// src/components/doctors/DoctorsList.tsx

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Doctor, Hospital, Department, Session } from "@/lib/definitions";
import DoctorsCard from "./ui/DoctorsCard";
import DoctorsFilters from "./ui/DoctorsFilters";
import DoctorsPagination from "./ui/DoctorsPagination";

interface DoctorsListProps {
    doctors: Doctor[];
    hospitals: Hospital[];
    departments: Department[];
    session: Session | null;
}

const ITEMS_PER_PAGE = 2;

const DoctorsList: React.FC<DoctorsListProps> = React.memo(
    ({ doctors, hospitals, departments, session }) => {
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
                    doctors={doctors}
                    hospitals={hospitals}
                    departments={departments}
                    session={session}
                    onFilterChange={onFilterChange}
                />
                <div className="flex bg-bluelight rounded-t-[20px] h-50 w-full p-4 pl-3">
                    <span className="font-semibold text-base">Doctor List</span>
                </div>
                <div className="flex flex-wrap justify-between gap-4 mt-6 mb-6">
                    {paginatedDoctors.map((doctor) => (
                        <DoctorsCard key={doctor.doctorId} doctor={doctor} />
                    ))}
                </div>
                <DoctorsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </>
        );
    }
);

export default DoctorsList;
