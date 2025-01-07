// src/components/patients/PatientsList.tsx

"use client";

import { useState, useMemo } from "react";
import { useSearch } from "@/app/context/SearchContext";
import { Patient, Hospital, Role } from "@/lib/definitions";
import PatientRow from "@/components/patients/ui/PatientRow";
import PatientsPagination from "@/components/patients/ui/PatientsPagination";
import PatientsFilters from "@/components/patients/ui/PatientsFilters";
import { format } from "date-fns";

interface PatientsListProps {
    patients: Patient[];
    totalPatients: number;
    hospitals: Hospital[];
    userRole: Role;
    hospitalId: number | null;
}

const ITEMS_PER_PAGE = 15;

export default function PatientsList({
    patients,
    totalPatients,
    hospitals,
    userRole,
    hospitalId,
}: PatientsListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredPatients, setFilteredPatients] = useState(patients);
    const { searchTerm } = useSearch();

    // Handle setting patients
    const onSetPatients = (updatedPatients: Patient[]) => {
        setFilteredPatients(updatedPatients);
    };

    // Handle filtering patients based on filter changes
    const onFilterChange = (filteredPatients: Patient[]) => {
        setFilteredPatients(filteredPatients);
    };

    // Apply search term filter with useMemo to minimize recalculations
    const searchFilteredPatients = useMemo(() => {
        const term = searchTerm.toLowerCase();

        return filteredPatients.filter((patient) => {
            const formattedDateOfBirth = patient.dateOfBirth
                ? format(new Date(patient.dateOfBirth), 'MM/dd/yyyy')
                : '';

            const genderMatch =
                term === 'other'
                    ? !['male', 'female'].includes(patient.gender.toLowerCase())
                    : patient.gender.toLowerCase() === term;

            return (
                patient.name.toLowerCase().includes(term) ||
                patient.email.toLowerCase().includes(term) ||
                patient.phoneNo.replace(/\s+/g, '').includes(term) ||
                patient.patientId.toString().includes(term) ||
                formattedDateOfBirth.includes(term) ||
                genderMatch
            );
        });
    }, [searchTerm, filteredPatients]);

    // Paginate the search-filtered patients based on currentPage
    const paginatedPatients = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return searchFilteredPatients.slice(start, end);
    }, [searchFilteredPatients, currentPage]);

    // Calculate total pages dynamically based on searchFilteredPatients length
    const totalPages = Math.ceil(
        searchFilteredPatients.length / ITEMS_PER_PAGE
    );


    // Fetch and navigate to edit patient
    const onEdit = async (patientId: number) => {
        // try {
        //     const patientDetails = await fetchPatientDetails(patientId);
        //     window.location.href = `/dashboard/patients/edit/${patientId}`;
        // } catch (error) {
        //     console.error("Failed to fetch patient details for edit:", error);
        // }
    };

    // Delete a patient by ID and refresh the list
    const onDelete = async (patientId: number) => {
        // try {
        //     await deletePatientById(patientId); // API call to delete patient
        //     setFilteredPatients((prev) => prev.filter((patient) => patient.patientId !== patientId));
        //     alert("Patient deleted successfully.");
        // } catch (error) {
        //     console.error("Failed to delete patient:", error);
        //     alert("Failed to delete patient.");
        // }
    };

    return (
        <div>
            <PatientsFilters
                hospitals={hospitals}
                userRole={userRole}
                hospitalId={hospitalId}                patients={patients}
                onFilterChange={onFilterChange}
                onSetPatients={onSetPatients}
            />
            <table className="w-full bg-bluelight/5 p-1 rounded-t-2xl border-separate border-spacing-y-4">
                <thead>
                    <tr className="text-gray-800">
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
                        <th className="text-center p-2 w-[2%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedPatients.map((patient) => (
                        <PatientRow
                            key={patient.patientId}
                            patient={patient}
                            userRole={userRole}
                            hospitalId={hospitalId}                            onEdit={() => onEdit(patient.patientId)}
                            onDelete={() => onDelete(patient.patientId)}
                        />
                    ))}
                </tbody>
            </table>
            <PatientsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}
