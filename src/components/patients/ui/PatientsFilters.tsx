// src/components/patients/ui/PatientsFilters.tsx

"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Patient, Hospital, Session, Appointment } from "@/lib/definitions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearch } from "@/app/context/SearchContext";
import {
    ChevronRight,
    // Hospital as HospitalIcon,
    CircleX as CancelledIcon,
} from "lucide-react";
import { fetchPatientsByRole } from "@/lib/data";
import { SymbolIcon } from "@radix-ui/react-icons";

interface PatientsFiltersProps {
    patients: Patient[];
    hospitals: Hospital[];
    session: Session | null;
    onFilterChange: (filteredPatients: Patient[]) => void;
    onSetPatients: (patients: Patient[]) => void;
}

const PatientsFilters: React.FC<PatientsFiltersProps> = ({
    patients,
    hospitals,
    session,
    onFilterChange,
    onSetPatients,
}) => {
    const { searchTerm, setSearchTerm } = useSearch();
    const [filterType, setFilterType] = useState("Filter By");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
        null
    );
    const [selectedHospitalName, setSelectedHospitalName] = useState<
        string | null
    >(null);
    const [selectedGender, setSelectedGender] = useState<string | null>(null);
    const [latestAppointmentsActive, setLatestAppointmentsActive] =
        useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

    // Helper function to sanitize input and phone numbers
    const sanitizeNumber = (input: string): string => input.replace(/\D/g, "");

    // Clear individual filters
    const clearHospitalFilter = () => {
        setSelectedHospitalId(null);
        setSelectedHospitalName(null);
    };

    // Active filters to display as tags
    const activeFilters = useMemo(() => {
        const filters = [];
        if (selectedHospitalName) filters.push({ label: selectedHospitalName, onClear: clearHospitalFilter });
        if (selectedGender) filters.push({ label: selectedGender, onClear: () => setSelectedGender(null) });
        if (selectedDate) filters.push({ label: selectedDate.toLocaleDateString(), onClear: () => setSelectedDate(null) });
        return filters;
    }, [selectedHospitalName, selectedGender, selectedDate]);

    // Filtered patient data based on active filters
    const filteredPatients = useMemo(() => {
        const sanitizedTerm = sanitizeNumber(searchTerm);

        return patients.filter((patient) => {
            // General filters based on filterType
            if (filterType === "Name" && searchTerm && !patient.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            if (filterType === "Reg No" && searchTerm && !patient.patientId.toString().includes(searchTerm)) return false;
            if (filterType === "Phone No" && searchTerm && !sanitizeNumber(patient.phoneNo).includes(sanitizedTerm)) return false;
            if (filterType === "Email" && searchTerm && !patient.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            // Specific filters
            if (selectedGender && patient.gender.toLowerCase() !== selectedGender.toLowerCase()) return false;
            if (selectedHospitalId && patient.hospitalId !== selectedHospitalId) return false;
            if (selectedDate && new Date(patient.dateOfBirth).toLocaleDateString() !== selectedDate.toLocaleDateString()) return false;

            return true;
        });
    }, [patients, searchTerm, filterType, selectedGender, selectedHospitalId, selectedDate]);

    // Update filtered patients when active filters change
    useEffect(() => {
        onFilterChange(filteredPatients);
    }, [filteredPatients, onFilterChange]);

    // Handle filter type selection
    const handleFilterSelection = (type: string) => {
        setFilterType(type);
        setSearchTerm("");
        clearHospitalFilter();
        setSelectedGender(null);
        setSelectedDate(null);
        setLatestAppointmentsActive(false);
    };

    const handleDateSelect = (date: Date | null) => {
        setSelectedDate(date);
        setSearchTerm("");
        setLatestAppointmentsActive(false);
    };

    const handleHospitalSelect = (hospitalId: number, hospitalName: string) => {
        setSelectedHospitalId(hospitalId);
        setSelectedHospitalName(hospitalName);
        setSearchTerm("");
        setLatestAppointmentsActive(false);
    };

    const handleGenderSelect = (gender: string) => {
        setSelectedGender(gender);
        setSearchTerm("");
        setLatestAppointmentsActive(false);
    };

    // Sort patients by latest appointments
    // const handleLastAppointmentsClick = useCallback(() => {
    //     const sortedPatients = [...patients].sort((a, b) => {
    //         // Find the latest appointment for patient A
    //         const latestApptA = a.appointments?.reduce<Appointment | undefined>(
    //             (latest, appt) => {
    //                 if (!latest || new Date(appt.appointmentDate).getTime() > new Date(latest.appointmentDate).getTime()) {
    //                     return appt;
    //                 }
    //                 return latest;
    //             },
    //             undefined
    //         );
    
    //         // Find the latest appointment for patient B
    //         const latestApptB = b.appointments?.reduce<Appointment | undefined>(
    //             (latest, appt) => {
    //                 if (!latest || new Date(appt.appointmentDate).getTime() > new Date(latest.appointmentDate).getTime()) {
    //                     return appt;
    //                 }
    //                 return latest;
    //             },
    //             undefined
    //         );
    
    //         // Handle cases where one or both patients have no appointments
    //         if (!latestApptA && !latestApptB) return 0; // Both have no appointments
    //         if (!latestApptA) return 1; // Patient A has no appointments
    //         if (!latestApptB) return -1; // Patient B has no appointments
    
    //         // Compare the latest appointment dates
    //         return new Date(latestApptB.appointmentDate).getTime() - new Date(latestApptA.appointmentDate).getTime();
    //     });
    
    //     onSetPatients(sortedPatients); // Update the patients list
    //     setLatestAppointmentsActive(true); // Indicate the button is active
    // }, [patients, onSetPatients]);

    // Refresh all filters and reload data
    const handleRefreshClick = () => {
        setFilterType("Filter By");
        setSelectedGender(null);
        clearHospitalFilter();
        setSelectedDate(null);
        setSearchTerm("");
        setLatestAppointmentsActive(false);

        const reloadPatients = async () => {
            if (session?.user) {
                const fetchedPatients = await fetchPatientsByRole(session.user);
                onSetPatients(fetchedPatients);
            }
        };
        reloadPatients();
    };

    return (
        <div className="flex flex-col min-w-full">
            <div className="flex items-center gap-4">
                {/* Refresh Button */}
                <button
                    onClick={handleRefreshClick}
                    className="p-2 rounded-[10px] h-[50px] w-[120px] gap-2 hover:shadow-gray-400 shadow-lg shadow-gray-400 text-black hover:bg-primary hover:text-white focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between"
                >
                    Refresh
                    <SymbolIcon className="w-5 h-5" />
                </button>

                {/* Active Filters Display */}
                <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                        <div
                            key={index}
                            className="bg-bluelight/5 text-primary p-2 rounded-[10px] h-[40px] w-auto gap-2 hover:shadow-gray-400 shadow-lg shadow-gray-400 hover:bg-bluelight hover:text-black focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-center"
                        >
                            <span className="font-normal text-sm">
                                {filter.label}
                            </span>
                            <button
                                onClick={filter.onClear}
                                className="flex items-center justify-center p-[2px] bg-white rounded-full"
                            >
                                <CancelledIcon className="h-5 w-5 text-center text-red-500 hover:text-white hover:bg-red-500 rounded-full" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-2 pt-0 pl-0 flex flex-row justify-between items-center mt-3">
                <div className="flex flex-row items-center gap-4">
                    {/* Dropdown Menu for Filters */}
                    <DropdownMenu onOpenChange={setShowOptions}>
                        <DropdownMenuTrigger asChild>
                            <button className="focus:outline-none focus:ring-1 focus:ring-primary flex items-center gap-2 p-2 rounded-[10px] h-[50px] hover:shadow-gray-400 shadow-lg shadow-gray-400 justify-between w-[200px]">
                                {filterType || "Filter By"}
                                <ChevronRight
                                    className={`ml-auto text-xl transform transition-transform ${
                                        showOptions ? "rotate-90" : ""
                                    }`}
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent className="bg-white rounded-[10px] p-2 w-[200px] mt-1">
                                {isSuperAdmin && (
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            Hospital
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-3 ml-4">
                                            {hospitals.map((hospital) => (
                                                <DropdownMenuItem
                                                    key={hospital.hospitalId}
                                                    onClick={() =>
                                                        handleHospitalSelect(
                                                            hospital.hospitalId,
                                                            hospital.name
                                                        )
                                                    }
                                                >
                                                    {hospital.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                )}

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>
                                        Gender
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-2 ml-4 max-w-[150px]">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleGenderSelect("Male")
                                            }
                                        >
                                            Male
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleGenderSelect("Female")
                                            }
                                        >
                                            Female
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleGenderSelect("Other")
                                            }
                                        >
                                            Other
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger
                                        onClick={() =>
                                            handleFilterSelection(
                                                "Date of Birth"
                                            )
                                        }
                                    >
                                        Date of Birth
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-2 ml-4 max-w-[260px]">
                                        <DatePicker
                                            selected={selectedDate || undefined}
                                            onChange={handleDateSelect}
                                            className="w-full p-2 text-sm border rounded-md"
                                            placeholderText="Select Date: MM/DD/YYYY"
                                        />
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuItem
                                    onClick={() =>
                                        handleFilterSelection("Reg No")
                                    }
                                >
                                    Reg No
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleFilterSelection("Name")
                                    }
                                >
                                    Name
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleFilterSelection("Phone No")
                                    }
                                >
                                    Phone No
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        handleFilterSelection("Email")
                                    }
                                >
                                    Email
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenu>

                    {/* Latest Appointments Button */}
                    <button
                        className={`flex items-center gap-2 p-3 font-semibold border-gray-300 text-black hover:bg-primary hover:text-white shadow-lg rounded-[10px] h-[50px] focus:outline-none focus:ring-1 focus:ring-primary ${
                            latestAppointmentsActive
                                ? "bg-primary text-white"
                                : ""
                        }`}
                    >
                        Latest Appointments
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientsFilters;