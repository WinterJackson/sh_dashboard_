// src/components/appointments/ui/appointments-table/AppointmentsPagination.tsx

"use client"

import React from "react";
import {
    Pagination,
    PaginationItem,
    PaginationContent,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

interface AppointmentsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const AppointmentsPagination: React.FC<AppointmentsPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onPageChange(newPage);
        }
    };
    return (
        <Pagination className="bg-light-accent p-4 rounded-b-2xl">
            <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-background-muted text-text-main rounded-[10px] mr-4 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 cursor-pointer"
            >
                Previous
            </PaginationPrevious>

            <PaginationContent className="flex items-center gap-2">
                {currentPage > 3 && (
                    <>
                        <PaginationItem
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-card text-card-foreground hover:bg-accent border"
                        >
                            1
                        </PaginationItem>
                        <PaginationEllipsis className="px-3 py-1 text-text-main" />
                    </>
                )}

                {currentPage > 2 && (
                    <PaginationItem
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-card text-card-foreground hover:bg-accent border"
                    >
                        {currentPage - 1}
                    </PaginationItem>
                )}

                <PaginationItem
                    isActive={true}
                    className="px-3 py-1 rounded-[10px] bg-primary text-primary-foreground cursor-pointer"
                >
                    {currentPage}
                </PaginationItem>

                {currentPage < totalPages - 1 && (
                    <PaginationItem
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-card text-card-foreground hover:bg-accent border"
                    >
                        {currentPage + 1}
                    </PaginationItem>
                )}

                {currentPage < totalPages - 2 && (
                    <>
                        <PaginationEllipsis className="px-3 py-1 text-text-main" />
                        <PaginationItem
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-card text-card-foreground hover:bg-accent border"
                        >
                            {totalPages}
                        </PaginationItem>
                    </>
                )}
            </PaginationContent>

            <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-background-muted text-text-main rounded-[10px] ml-4 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 cursor-pointer"
            >
                Next
            </PaginationNext>
        </Pagination>
    );
};

export default AppointmentsPagination;
