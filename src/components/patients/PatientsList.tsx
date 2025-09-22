// src/components/patients/PatientsList.tsx

"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearch } from "@/app/context/SearchContext";
import { Patient, Hospital, Role, FetchedPatient } from "@/lib/definitions";
import PatientRow from "@/components/patients/ui/patients-table/PatientRow";
import PatientsPagination from "@/components/patients/ui/patients-table/PatientsPagination";
import PatientsFilters from "@/components/patients/ui/patients-table/PatientsFilters";
import { format } from "date-fns";
import { useDeletePatients } from "@/hooks/useDeletePatients";
import Delete from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import ConfirmationModal from "@/components/patients/ui/patient-modals/ConfirmationModal";
import React from "react";

interface PatientsListProps {
    patients: FetchedPatient[];
    totalPatients: number;
    hospitals: Hospital[];
    userRole: Role;
    hospitalId: number | null;
}

const ITEMS_PER_PAGE = 15;

const PatientsList: React.FC<PatientsListProps> = React.memo(({
    patients,
    totalPatients,
    hospitals,
    userRole,
    hospitalId,
}) => {
    const { data: session } = useSession();
    const { mutate: deletePatients, isPending: isDeleting } = 
        useDeletePatients();
    const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
    const [showDeleteError, setShowDeleteError] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [deletedPatientDetails, setDeletedPatientDetails] = useState<{ 
        name: string;
        patientId: number;
    } | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPatients, setFilteredPatients] = useState(patients);
    const { searchTerm } = useSearch();

    useEffect(() => {
        setFilteredPatients(patients);
    }, [patients]);

    // State for the confirmation modal
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
            setSelectedPatients(
                paginatedPatients.map((patient) => patient.patientId)
            );
        } else {
            setSelectedPatients([]);
        }
    };

    const handleSingleSelect = (patientId: number, checked: boolean) => {
        setSelectedPatients((prev) => 
            checked 
                ? [...prev, patientId]
                : prev.filter((id) => id !== patientId)
        );
    };

    const handleBulkDelete = () => {
        if (!selectedPatients.length) return;

        // Open the confirmation modal for bulk delete
        setModalConfig({
            title: "Delete Patients",
            message: `Are you sure you want to delete ${selectedPatients.length} patient(s)? This action cannot be undone.`, 
            onConfirm: () => {
                deletePatients(
                    {
                        patientIds: selectedPatients,
                        user: {
                            role: userRole,
                            hospitalId: hospitalId,
                            userId: session?.user?.id || null,
                        },
                    },
                    {
                        onSuccess: () => {
                            setFilteredPatients((prev) => 
                                prev.filter(
                                    (patient) => 
                                        !selectedPatients.includes(
                                            patient.patientId
                                        )
                                )
                            );
                            setSelectedPatients([]);
                            setShowDeleteSuccess(true);
                            setShowDeleteError(false);
                        },
                        onError: () => setShowDeleteError(true),
                    }
                );
                setIsConfirmationModalOpen(false);
            },
        });
        setIsConfirmationModalOpen(true);
    };

    const onDelete = async (patientId: number) => {
        // Find the patient to be deleted
        const patientToDelete = filteredPatients.find(
            (patient) => patient.patientId === patientId
        );

        if (!patientToDelete) return;

        const profile = patientToDelete.user?.profile;
        const user = patientToDelete.user;

        const fullName = `${profile?.firstName ?? ""} ${ 
            profile?.lastName ?? ""
        }`.trim();

        // Open confirmation modal for single delete
        setModalConfig({
            title: "Delete Patient",
            message:
                `Are you sure you want to delete the patient:\n` +
                `**${fullName} (Patient ID: ${patientToDelete.patientId})**\n` +
                `This action cannot be undone.`, 
            onConfirm: () => {
                deletePatients(
                    {
                        patientIds: [patientId],
                        user: {
                            role: userRole,
                            hospitalId: hospitalId,
                            userId: session?.user?.id || null,
                        },
                    },
                    {
                        onSuccess: () => {
                            setFilteredPatients((prev) => 
                                prev.filter(
                                    (patient) => patient.patientId !== patientId
                                )
                            );
                            setShowDeleteSuccess(true);
                            setShowDeleteError(false);
                            setDeletedPatientDetails({
                                name: fullName,
                                patientId: patientToDelete.patientId,
                            });
                        },
                        onError: () => setShowDeleteError(true),
                    }
                );
                setIsConfirmationModalOpen(false);
            },
        });
        setIsConfirmationModalOpen(true);
    };

    const searchFilteredPatients = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return filteredPatients.filter((patient) => {
            const profile = patient.user?.profile;
            const user = patient.user;

            const fullName = `${profile?.firstName ?? ""} ${ 
                profile?.lastName ?? ""
            }`.toLowerCase();

            // Format date of birth
            const formattedDateOfBirth = profile?.dateOfBirth 
                ? format(new Date(profile.dateOfBirth), "MM/dd/yyyy") 
                : "";

            // Gender match logic
            const genderMatch = 
                term === "other"
                    ? !["male", "female"].includes(
                          profile?.gender?.toLowerCase() || ""
                      )
                    : profile?.gender?.toLowerCase() === term;

            return (
                fullName.includes(term) ||
                user?.email?.toLowerCase().includes(term) ||
                (profile?.phoneNo || "").replace(/\s+/g, "").includes(term) ||
                patient.patientId.toString().includes(term) ||
                formattedDateOfBirth.includes(term) ||
                genderMatch
            );
        });
    }, [searchTerm, filteredPatients]);

    const paginatedPatients = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return searchFilteredPatients.slice(start, end);
    }, [searchFilteredPatients, currentPage]);

    const totalPages = Math.ceil(
        searchFilteredPatients.length / ITEMS_PER_PAGE
    );

    const onSetPatients = (updatedPatients: FetchedPatient[]) => {
        setFilteredPatients(updatedPatients);
    };

    const onFilterChange = (filteredPatients: FetchedPatient[]) => {
        setFilteredPatients(filteredPatients);
    };

    return (
        <div className="relative">
            {isDeleting && (
                <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg shadow-lg">
                        Deleting {selectedPatients.length} patient(s)...
                    </div>
                </div>
            )}

            {/* Success Message */}
            {showDeleteSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-[10px] relative mb-4">
                    {deletedPatientDetails ? (
                        <span>
                            Patient{" "}
                            <strong>{deletedPatientDetails.name}</strong> (ID:{" "}
                            <strong>{deletedPatientDetails.patientId}</strong>)
                            deleted successfully.
                        </span>
                    ) : (
                        <span>
                            {selectedPatients.length > 1
                                ? `${selectedPatients.length} patients deleted successfully.`
                                : "Patient deleted successfully."}
                        </span>
                    )}
                    <button
                        onClick={() => {
                            setShowDeleteSuccess(false);
                            setDeletedPatientDetails(null);
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
                    Error deleting patients. Please try again.
                    <button
                        onClick={() => setShowDeleteError(false)}
                        className="absolute top-0 right-0 px-2 py-1"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Selected Patients Count */}
            {selectedPatients.length > 0 && (
                <div className="bg-slate-two border border-primary text-foreground p-3 rounded-[10px] relative mb-2">
                    {selectedPatients.length === 1
                        ? "1 patient selected."
                        : `${selectedPatients.length} patients selected.`}
                </div>
            )}

            <PatientsFilters
                hospitals={hospitals}
                userRole={userRole}
                hospitalId={hospitalId}
                patients={patients}
                onFilterChange={onFilterChange}
                onSetPatients={onSetPatients}
            />

            <table className="w-full mt-4 bg-slate p-1 rounded-t-2xl border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-foreground">
                        <th className="text-left p-2 w-[8%]">
                            {totalPatients} Patients
                        </th>
                        <th className="text-left pl-16 p-2 w-[25%]">
                            Basic Info
                        </th>
                        <th className="text-center p-2 w-[15%] whitespace-nowrap">
                            Phone No.
                        </th>
                        <th className="text-center p-2 w-[10%] whitespace-nowrap">
                            Reg No.
                        </th>
                        <th className="text-center p-2 w-[15%]">Last Appt</th>
                        <th className="text-center p-2 w-[15%]">Next Appt</th>
                        <th className="text-center p-2 w-[15%]">Reason</th>
                        {(userRole === Role.ADMIN ||
                            userRole === Role.SUPER_ADMIN) && (
                            <th className="text-center p-2 w-[2%]">
                                <div className="flex flex-col items-center justify-center gap-1 p-2 rounded-[10px] bg-background shadow-sm shadow-shadow-main ">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4"
                                        onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                        }
                                        checked={
                                            selectedPatients.length > 0 &&
                                            selectedPatients.length ===
                                                paginatedPatients.length
                                        }
                                        ref={(el) => {
                                            if (el) {
                                                el.indeterminate = 
                                                    selectedPatients.length > 
                                                        0 &&
                                                    selectedPatients.length < 
                                                        paginatedPatients.length;
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleBulkDelete}
                                        disabled={selectedPatients.length === 0}
                                        className="text-primary hover:text-red-700"
                                        aria-label="Delete selected patients"
                                    >
                                        <Delete className="w-7 h-7" />
                                    </button>
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {paginatedPatients.map((patient) => (
                        <PatientRow
                            key={patient.patientId}
                            patient={patient}
                            onDelete={() => onDelete(patient.patientId)}
                            onSelect={handleSingleSelect}
                            isSelected={selectedPatients.includes(
                                patient.patientId
                            )}
                        />
                    ))}
                </tbody>
            </table>

            <PatientsPagination
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
});

export default PatientsList;
