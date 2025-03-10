// src/components/hospitals/HospitalsPagination.tsx

"use client"

import React from "react";
import { Pagination, PaginationNext, PaginationPrevious, PaginationItem, PaginationContent } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HospitalsPaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
}

const HospitalsPagination: React.FC<HospitalsPaginationProps> = ({ totalItems, itemsPerPage, currentPage }) => {
    const router = useRouter();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page: number) => {
        router.push(`/dashboard/hospitals?page=${page}`);
    };

    return (
        <Pagination className="bg-bluelight/5 p-3 mt-2 rounded-b-2xl">
            <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded-[10px] mr-4 hover:bg-gray-300 disabled:opacity-50"
            />
            <PaginationContent className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem
                        key={i}
                        isActive={i + 1 === currentPage}
                        onClick={() => handlePageChange(i + 1)}
                        className={cn(
                            "px-3 py-1 rounded-[10px] cursor-pointer transition-colors",
                            i + 1 === currentPage ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-200"
                        )}
                    >
                        {i + 1}
                    </PaginationItem>
                ))}
            </PaginationContent>
            <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded-[10px] ml-4 hover:bg-gray-300 disabled:opacity-50"
            />
        </Pagination>
    );
};

export default HospitalsPagination;
