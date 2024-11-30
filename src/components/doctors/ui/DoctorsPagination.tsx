// src/components/patients/ui/DoctorsPagination.tsx

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { FC } from "react";

interface DoctorsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const DoctorsPagination: FC<DoctorsPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            console.log("Changing to page:", newPage);
            onPageChange(newPage);
        }
    };

    return (
        <Pagination className="bg-bluelight p-4 rounded-b-2xl">
            <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-300 text-black rounded-[10px] mr-4 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer"
            >
                Previous
            </PaginationPrevious>

            <PaginationContent className="flex items-center gap-2">
                {currentPage > 3 && (
                    <>
                        <PaginationItem
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
                        >
                            1
                        </PaginationItem>
                        <PaginationEllipsis className="px-3 py-1 text-gray-500" />
                    </>
                )}

                {currentPage > 2 && (
                    <PaginationItem
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
                    >
                        {currentPage - 1}
                    </PaginationItem>
                )}

                <PaginationItem
                    isActive={true}
                    className="px-3 py-1 rounded-[10px] bg-primary text-white cursor-pointer"
                >
                    {currentPage}
                </PaginationItem>

                {currentPage < totalPages - 1 && (
                    <PaginationItem
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
                    >
                        {currentPage + 1}
                    </PaginationItem>
                )}

                {currentPage < totalPages - 2 && (
                    <>
                        <PaginationEllipsis className="px-3 py-1 text-gray-500" />
                        <PaginationItem
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-1 rounded-[10px] cursor-pointer transition-colors bg-gray-100 text-gray-700 hover:bg-blue-200"
                        >
                            {totalPages}
                        </PaginationItem>
                    </>
                )}
            </PaginationContent>

            <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-300 text-black rounded-[10px] ml-4 hover:bg-primary hover:text-white disabled:opacity-50 cursor-pointer"
            >
                Next
            </PaginationNext>
        </Pagination>
    );
};

export default DoctorsPagination;
