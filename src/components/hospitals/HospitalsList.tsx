// src/components/hospitals/HospitalsList.tsx

"use client";

import { useState, useMemo } from "react";
import { useSearch } from "@/app/context/SearchContext";
import { Hospital, Role } from "@/lib/definitions";
import HospitalRow from "./ui/hospitals-table/HospitalRow";
import HospitalsPagination from "./ui/hospitals-table/HospitalsPagination";
import HospitalsFilters from "./ui/hospitals-table/HospitalsFilters";
import { useDeleteHospitals } from "@/hooks/useDeleteHospitals";
import Delete from "@mui/icons-material/Delete";
import ConfirmationModal from "./ui/hospital-modals/ConfirmationModal";

interface HospitalsListProps {
    hospitals: Hospital[];
    totalHospitals: number;
    userRole: Role;
}

const ITEMS_PER_PAGE = 15;

export default function HospitalsList({
    hospitals: initialHospitals,
    totalHospitals,
    userRole,
}: HospitalsListProps) {
    const { mutate: deleteHospitals, isPending: isDeleting } =
        useDeleteHospitals();
    const [selectedHospitals, setSelectedHospitals] = useState<number[]>([]);
    const [showDeleteError, setShowDeleteError] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [deletedHospitalDetails, setDeletedHospitalDetails] = useState<{
        name: string;
        hospitalId: number;
    } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);

    const [filteredHospitals, setFilteredHospitals] =
        useState<Hospital[]>(initialHospitals);

    const { searchTerm } = useSearch();

    // Confirmation-modal state
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
        useState(false);
    const [modalConfig, setModalConfig] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        title: "",
        message: "",
        onConfirm: () => {},
    });

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedHospitals(
                paginatedHospitals.map((hospital) => hospital.hospitalId)
            );
        } else {
            setSelectedHospitals([]);
        }
    };

    const handleSingleSelect = (hospitalId: number, checked: boolean) => {
        setSelectedHospitals((prev) =>
            checked
                ? [...prev, hospitalId]
                : prev.filter((id) => id !== hospitalId)
        );
    };

    const handleBulkDelete = () => {
        if (selectedHospitals.length === 0) return;

        setModalConfig({
            title: "Delete Hospitals",
            message: `Are you sure you want to delete ${selectedHospitals.length} hospital(s)? This action cannot be undone.`,
            onConfirm: () => {
                deleteHospitals(selectedHospitals, {
                    onSuccess: () => {
                        setFilteredHospitals((prev) =>
                            prev.filter(
                                (hospital) =>
                                    !selectedHospitals.includes(
                                        hospital.hospitalId
                                    )
                            )
                        );
                        setSelectedHospitals([]);
                        setShowDeleteSuccess(true);
                        setShowDeleteError(false);
                    },
                    onError: () => setShowDeleteError(true),
                });
                setIsConfirmationModalOpen(false);
            },
        });
        setIsConfirmationModalOpen(true);
    };

    const onDelete = async (hospitalId: number) => {
        const hospitalToDelete = filteredHospitals.find(
            (h) => h.hospitalId === hospitalId
        );
        if (!hospitalToDelete) return;

        setModalConfig({
            title: "Delete Hospital",
            message:
                `Are you sure you want to delete the hospital:\n` +
                `**${hospitalToDelete.hospitalName} (Hospital ID: ${hospitalToDelete.hospitalId})**\n` +
                `This action cannot be undone.`,
            onConfirm: () => {
                deleteHospitals([hospitalId], {
                    onSuccess: () => {
                        setFilteredHospitals((prev) =>
                            prev.filter((h) => h.hospitalId !== hospitalId)
                        );
                        setShowDeleteSuccess(true);
                        setShowDeleteError(false);
                        setDeletedHospitalDetails({
                            name: hospitalToDelete.hospitalName,
                            hospitalId: hospitalToDelete.hospitalId,
                        });
                    },
                    onError: () => setShowDeleteError(true),
                });
                setIsConfirmationModalOpen(false);
            },
        });
        setIsConfirmationModalOpen(true);
    };

    /**
     *    - filter by searchTerm
     *    - sort filtered result by hospitalId ascending
     *    - return sorted array for pagination
     */
    const searchFilteredSortedHospitals = useMemo(() => {
        const term = searchTerm.toLowerCase();

        // Filter
        const filtered = filteredHospitals.filter((hospital) => {
            return (
                hospital.hospitalName.toLowerCase().includes(term) ||
                (hospital.county || "").toLowerCase().includes(term) ||
                (hospital.town || "").toLowerCase().includes(term) ||
                (hospital.referralCode || "").toLowerCase().includes(term) ||
                hospital.hospitalId.toString().includes(term)
            );
        });

        // Sort by hospitalId ascending
        return [...filtered].sort((a, b) => a.hospitalId - b.hospitalId);
    }, [searchTerm, filteredHospitals]);

    const paginatedHospitals = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return searchFilteredSortedHospitals.slice(start, end);
    }, [searchFilteredSortedHospitals, currentPage]);

    const totalPages = Math.ceil(
        searchFilteredSortedHospitals.length / ITEMS_PER_PAGE
    );

    const onSetHospitals = (updatedHospitals: Hospital[]) => {
        setFilteredHospitals(updatedHospitals);
    };

    const onFilterChange = (newFiltered: Hospital[]) => {
        setFilteredHospitals(newFiltered);
    };

    return (
        <div className="relative">
            {isDeleting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        Deleting {selectedHospitals.length} hospital(s)...
                    </div>
                </div>
            )}

            {/* Success Message */}
            {showDeleteSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-[10px] relative mb-4">
                    {deletedHospitalDetails ? (
                        <span>
                            Hospital{" "}
                            <strong>{deletedHospitalDetails.name}</strong> (ID:{" "}
                            <strong>{deletedHospitalDetails.hospitalId}</strong>
                            ) deleted successfully.
                        </span>
                    ) : (
                        <span>
                            {selectedHospitals.length > 1
                                ? `${selectedHospitals.length} hospitals deleted successfully.`
                                : "Hospital deleted successfully."}
                        </span>
                    )}
                    <button
                        onClick={() => {
                            setShowDeleteSuccess(false);
                            setDeletedHospitalDetails(null);
                        }}
                        className="absolute top-0 right-0 px-2 py-1"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Error Message */}
            {showDeleteError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[10px] relative mb-4">
                    Error deleting hospitals. Please try again.
                    <button
                        onClick={() => setShowDeleteError(false)}
                        className="absolute top-0 right-0 px-2 py-1"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Selected Hospitals Count + Bulk Delete Button */}
            {selectedHospitals.length > 0 && (
                <div className="bg-bluelight/5 border border-primary text-gray-700 p-3 rounded-[10px] relative mb-2">
                    {selectedHospitals.length === 1
                        ? "1 hospital selected."
                        : `${selectedHospitals.length} hospitals selected.`}
                    <button
                        onClick={handleBulkDelete}
                        disabled={selectedHospitals.length === 0}
                        className="absolute right-4 top-3 text-red-500 hover:text-red-700 flex items-center"
                    >
                        <Delete className="mr-1" /> Delete Selected
                    </button>
                </div>
            )}

            <HospitalsFilters
                hospitals={initialHospitals}
                onFilterChange={onFilterChange}
                onSetHospitals={onSetHospitals}
            />

            <table className="w-full bg-bluelight/5 p-1 rounded-t-2xl border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-gray-800">
                        <th className="text-left p-2 w-[8%] text-[13px]">
                            {totalHospitals} Hospitals
                        </th>
                        <th className="text-center p-2 w-[15%]">Logo</th>
                        <th className="text-left p-2 w-[20%]">Name</th>
                        <th className="text-center p-2 w-[10%]">ID</th>
                        <th className="text-center p-2 w-[20%] whitespace-nowrap">
                            Phone
                        </th>
                        <th className="text-center p-2 w-[10%]">County</th>
                        <th className="text-center p-2 w-[10%]">Town</th>
                        <th className="text-center p-2 w-[12%]">Type</th>
                        <th className="text-center p-2 w-[10%]">Level</th>
                        <th className="text-center p-2 w-[10%] whitespace-nowrap">
                            Ref. Code
                        </th>
                        {userRole === Role.SUPER_ADMIN && (
                            <th className="text-center p-2 w-[5%]">
                                <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-[10px] bg-white shadow-sm shadow-gray-400">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4"
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                        checked={
                                            selectedHospitals.length > 0 &&
                                            selectedHospitals.length ===
                                                paginatedHospitals.length
                                        }
                                        ref={(el) => {
                                            if (el) {
                                                el.indeterminate =
                                                    selectedHospitals.length >
                                                        0 &&
                                                    selectedHospitals.length <
                                                        paginatedHospitals.length;
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleBulkDelete}
                                        disabled={
                                            selectedHospitals.length === 0
                                        }
                                        className="text-primary hover:text-red-700"
                                        aria-label="Delete selected hospitals"
                                    >
                                        <Delete className="w-7 h-7" />
                                    </button>
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {paginatedHospitals.map((hospital) => (
                        <HospitalRow
                            key={hospital.hospitalId}
                            hospital={hospital}
                            userRole={userRole}
                            onDelete={() => onDelete(hospital.hospitalId)}
                            onSelect={handleSingleSelect}
                            isSelected={selectedHospitals.includes(
                                hospital.hospitalId
                            )}
                        />
                    ))}
                </tbody>
            </table>

            <HospitalsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={() => setIsConfirmationModalOpen(false)}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
            />
        </div>
    );
}
