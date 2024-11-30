// src/components/appointments/ui/AppointmentsFilters.tsx

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { differenceInYears } from "date-fns";
import { Appointment, Session, Role, Hospital } from "@/lib/definitions";
import { useSearch } from "@/app/context/SearchContext";
import { DatePicker } from "@/components/appointments/DatePicker";
import { DateRangePicker } from "@/components/appointments/DateRangePicker";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, HospitalIcon, CalendarClock as RescheduleIcon, CirclePause as PendingIcon, CircleX as CancelledIcon, CalendarCheck as ConfirmedIcon, CircleCheckBig as CompletedIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { SymbolIcon } from "@radix-ui/react-icons";

interface AppointmentsFiltersProps {
    appointments: Appointment[];
    session: Session | null;
    hospitals: Hospital[];
    onFilterChange: (filteredAppointments: Appointment[]) => void;
    onSetAppointments: (updatedAppointments: Appointment[]) => void;
}

export default function AppointmentsFilters({
    appointments,
    session,
    hospitals,
    onFilterChange,
    onSetAppointments,
}: AppointmentsFiltersProps) {
    const [filterType, setFilterType] = useState<string>("");
    const [selectedHospital, setSelectedHospital] = useState<number | null>(null);
    const [selectedHospitalName, setSelectedHospitalName] = useState<string | null>(null);
    const isSuperAdmin = session?.user.role === Role.SUPER_ADMIN;
    const [showOptions, setShowOptions] = useState(false);
    const [appointmentTypeFilter, setAppointmentTypeFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null); // New state for status dropdown
    const [dateFilter, setDateFilter] = useState<Date | null>(null);
    const [dateRangeFilter, setDateRangeFilter] = useState<DateRange | null>(null);
    const { searchTerm, clearSearchTerm } = useSearch();

    const clearHospitalFilter = () => {
        setSelectedHospital(null);
        setSelectedHospitalName(null);
    };

    // Track all active filters for display and removal
    const activeFilters = useMemo(() => [
        ...(selectedStatusFilter ? [{ label: selectedStatusFilter, onClear: () => setSelectedStatusFilter(null) }] : []),
        ...(appointmentTypeFilter ? [{ label: appointmentTypeFilter, onClear: () => setAppointmentTypeFilter(null) }] : []),
        ...(selectedHospitalName ? [{ label: selectedHospitalName, onClear: clearHospitalFilter }] : []),
        ...(dateFilter ? [{ label: dateFilter.toLocaleDateString(), onClear: () => setDateFilter(null) }] : []),
        ...(dateRangeFilter ? [{ label: `${dateRangeFilter.from?.toLocaleDateString()} - ${dateRangeFilter.to?.toLocaleDateString()}`, onClear: () => setDateRangeFilter(null) }] : []),
    ], [
        selectedStatusFilter,
        appointmentTypeFilter,
        selectedHospitalName,
        dateFilter,
        dateRangeFilter,
    ]);

    // Filtering logic
    const filteredAppointments = useMemo(() => {
        return appointments.filter((appointment) => {
            const searchTextLower = searchTerm.toLowerCase();
            let filterMatch = true;

            if (searchTerm) {
                switch (filterType) {
                    case "Patient Name":
                        filterMatch = appointment.patient.name
                            .toLowerCase()
                            .includes(searchTextLower);
                        break;
                    case "Age":
                        if (appointment.patient.dateOfBirth) {
                            const age = differenceInYears(
                                new Date(),
                                new Date(appointment.patient.dateOfBirth)
                            ).toString();
                            filterMatch = age.includes(searchTextLower);
                        }
                        break;
                    case "Patient ID":
                        filterMatch = appointment.patient.patientId
                            .toString()
                            .includes(searchTextLower);
                        break;
                    case "Doctor":
                        filterMatch = appointment.doctor.user.username
                            .toLowerCase()
                            .includes(searchTextLower);
                        break;
                    case "Type":
                        if (appointmentTypeFilter) {
                            filterMatch = appointment.type === appointmentTypeFilter;
                        }
                        break;
                    case "Hospital":
                        if (isSuperAdmin && appointment.hospital?.name) {
                            filterMatch = appointment.hospital.name
                                .toLowerCase()
                                .includes(searchTextLower);
                        }
                        break;
                    case "Status":
                        if (selectedStatusFilter) {
                            filterMatch = appointment.status === selectedStatusFilter;
                        }
                        break;
                    default:
                        const isNameMatch = appointment.patient.name
                            .toLowerCase()
                            .includes(searchTextLower);
                        const isAgeMatch = appointment.patient.dateOfBirth
                            ? differenceInYears(new Date(), new Date(appointment.patient.dateOfBirth))
                                  .toString()
                                  .includes(searchTextLower)
                            : false;
                        const isIdMatch = appointment.patient.patientId.toString().includes(searchTextLower);
                        const isDateMatch = new Date(appointment.appointmentDate)
                            .toLocaleDateString()
                            .includes(searchTextLower);
                        const isDoctorMatch = appointment.doctor.user.username
                            .toLowerCase()
                            .includes(searchTextLower);
                        const isTypeMatch = appointment.type
                            .toLowerCase()
                            .includes(searchTextLower);
                        const isHospitalMatch = appointment.hospital?.name
                            ? appointment.hospital.name
                                  .toLowerCase()
                                  .includes(searchTextLower)
                            : false;
                        const isStatusMatch = appointment.status
                            ? appointment.status
                                  .toLowerCase()
                                  .includes(searchTextLower)
                            : false;

                        filterMatch =
                            isNameMatch ||
                            isAgeMatch ||
                            isIdMatch ||
                            isDateMatch ||
                            isDoctorMatch ||
                            isTypeMatch ||
                            isHospitalMatch ||
                            isStatusMatch;
                        break;
                }
            }

            if (statusFilter.length > 0) {
                filterMatch =
                    filterMatch && statusFilter.includes(appointment.status || "");
            }

            if (appointmentTypeFilter) {
                filterMatch = filterMatch && appointment.type === appointmentTypeFilter;
            }

            if (dateFilter) {
                const appointmentDate = new Date(appointment.appointmentDate);
                filterMatch =
                    filterMatch &&
                    appointmentDate.toLocaleDateString() ===
                        dateFilter.toLocaleDateString();
            } else if (dateRangeFilter?.from && dateRangeFilter?.to) {
                const appointmentDate = new Date(appointment.appointmentDate);
                filterMatch =
                    filterMatch &&
                    appointmentDate >= dateRangeFilter.from &&
                    appointmentDate <= dateRangeFilter.to;
            }

            if (selectedHospital) {
                filterMatch = filterMatch && appointment.hospitalId === selectedHospital;
            }

            if (selectedStatusFilter) {
                filterMatch = filterMatch && appointment.status === selectedStatusFilter;
            }

            return filterMatch;
        });
    }, [
        appointments,
        searchTerm,
        filterType,
        statusFilter,
        selectedStatusFilter,
        dateFilter,
        dateRangeFilter,
        appointmentTypeFilter,
        selectedHospital,
    ]);

    // Update filtered appointments
    useEffect(() => {
        onFilterChange(filteredAppointments);
        onSetAppointments(filteredAppointments);
    }, [filteredAppointments, onFilterChange, onSetAppointments]);

    const handleFilterTypeChange = (type: string) => {
        setFilterType(type);
        if (type !== "Date") {
            setDateFilter(null);
            setDateRangeFilter(null);
        }
    };

    const handleStatusFilter = (statuses: string[]) => {
        setStatusFilter(statuses);
    };

    const handleStatusSelect = (status: string) => {
        setSelectedStatusFilter(status);
        setFilterType("Status");
    };

    const clearFilters = () => {
        setFilterType("");
        setAppointmentTypeFilter(null);
        setStatusFilter([]);
        setSelectedStatusFilter(null);
        setDateFilter(null);
        setDateRangeFilter(null);
        setSelectedHospital(null);
        setSelectedHospitalName(null);
    };

    const handleRefresh = () => {
        clearFilters();
        clearSearchTerm();
        onSetAppointments(appointments);
    };

    const handleDateChange = (date: Date | undefined) => {
        setDateFilter(date || null);
        setDateRangeFilter(null);
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRangeFilter(
            range
                ? {
                      from: range.from || new Date(0),
                      to: range.to || new Date(),
                  }
                : null
        );
        setDateFilter(null);
    };

    return (
        <div className="flex flex-col min-w-full">
            <div className="flex items-center gap-4">
                <button
                    onClick={handleRefresh}
                    className="p-2 rounded-[10px] h-[50px] w-[120px] gap-2 hover:shadow-gray-400 shadow-lg shadow-gray-400 text-black hover:bg-primary hover:text-white focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-between"
                >
                    <span className="pr-1">Refresh</span>
                    <SymbolIcon className="h-4 w-4" />
                </button>

                <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter, index) => (
                        <div
                            key={index}
                            className="bg-bluelight/5 text-primary p-2 rounded-[10px] h-[40px] w-auto gap-2 hover:shadow-gray-400 shadow-lg shadow-gray-400 hover:bg-bluelight hover:text-black focus:outline-none focus:ring-1 focus:ring-primary flex items-center justify-center"
                        >
                            <span className="font-normal text-sm">{filter.label}</span>
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
                    <DropdownMenu onOpenChange={setShowOptions}>
                        <DropdownMenuTrigger asChild>
                            <button className="focus:outline-none focus:ring-1 focus:ring-primary flex items-center gap-2 p-2 rounded-[10px] h-[50px] hover:shadow-gray-400 shadow-lg shadow-gray-400 justify-between w-[150px]">
                                {filterType || "Filter By"}
                                <ChevronRight
                                    className={`transform transition-transform duration-300 ${
                                        showOptions ? "rotate-90" : ""
                                    }`}
                                />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent className="w-[150px] mt-1 rounded-[10px] p-2">
                                {isSuperAdmin && (
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="p-2 rounded-[5px]">
                                            Hospital
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-3 ml-4 max-w-auto mt-[-10px]">
                                            {hospitals.map((hospital) => (
                                                <DropdownMenuItem
                                                    key={hospital.hospitalId}
                                                    onSelect={() => {
                                                        setSelectedHospital(
                                                            hospital.hospitalId
                                                        );
                                                        setSelectedHospitalName(
                                                            hospital.name
                                                        );
                                                        setFilterType(
                                                            "Hospital"
                                                        );
                                                    }}
                                                    className="p-2 rounded-[5px]"
                                                >
                                                    {hospital.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                )}

                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="p-2 rounded-[5px]">
                                        Status
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-3 ml-4 max-w-auto mt-[-10px]">
                                        {[
                                            "Confirmed",
                                            "Completed",
                                            "Rescheduled",
                                            "Cancelled",
                                            "Pending",
                                        ].map((status) => (
                                            <DropdownMenuItem
                                                key={status}
                                                onSelect={() =>
                                                    handleStatusSelect(status)
                                                }
                                                className="p-2 rounded-[5px]"
                                            >
                                                {status}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                {[
                                    "Date",
                                    "Type",
                                    "Doctor",
                                    "Patient ID",
                                    "Patient Name",
                                    "Age",
                                ].map((option) => (
                                    <DropdownMenuItem
                                        key={option}
                                        onSelect={() =>
                                            handleFilterTypeChange(option)
                                        }
                                        className="p-2 rounded-[5px] hover:bg-primary hover:text-white"
                                    >
                                        {option}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenu>

                    <button
                        className={`flex-grow px-4 py-2 rounded-[10px] h-[50px] text-nowrap w-auto font-semibold text-black hover:bg-primary hover:text-white hover:shadow-gray-400 shadow-lg shadow-gray-400 ${
                            statusFilter.includes("Confirmed") ||
                            statusFilter.includes("Completed") ||
                            statusFilter.includes("Rescheduled")
                                ? "bg-primary text-white"
                                : ""
                        }`}
                        onClick={() =>
                            handleStatusFilter([
                                "Confirmed",
                                "Completed",
                                "Rescheduled",
                            ])
                        }
                    >
                        Approved Appointments
                    </button>
                    <button
                        className={`flex-grow px-4 py-2 rounded-[10px] h-[50px] text-nowrap w-auto font-semibold text-black hover:bg-primary hover:text-white hover:shadow-gray-400 shadow-lg shadow-gray-400 ${
                            statusFilter.includes("Pending") ||
                            statusFilter.includes("Cancelled")
                                ? "bg-primary text-white"
                                : ""
                        }`}
                        onClick={() =>
                            handleStatusFilter(["Pending", "Cancelled"])
                        }
                    >
                        Other Appointments
                    </button>

                    {filterType === "Type" && (
                        <>
                            <button
                                className={`flex-grow px-4 py-2 rounded-[10px] h-[50px] text-nowrap w-auto font-semibold text-black hover:bg-primary hover:text-white hover:shadow-gray-400 shadow-lg shadow-gray-400 ${
                                    appointmentTypeFilter === "Walk In"
                                        ? "bg-primary text-white"
                                        : ""
                                }`}
                                onClick={() =>
                                    setAppointmentTypeFilter("Walk In")
                                }
                            >
                                Walk In
                            </button>
                            <button
                                className={`flex-grow px-4 py-2 rounded-[10px] h-[50px] text-nowrap w-auto font-semibold text-black hover:bg-primary hover:text-white hover:shadow-gray-400 shadow-lg shadow-gray-400 ${
                                    appointmentTypeFilter === "Virtual"
                                        ? "bg-primary text-white"
                                        : ""
                                }`}
                                onClick={() =>
                                    setAppointmentTypeFilter("Virtual")
                                }
                            >
                                Virtual
                            </button>
                        </>
                    )}

                    {filterType === "Date" && (
                        <div className="flex flex-grow flex-row items-center gap-2">
                            <DatePicker onDateChange={handleDateChange} />
                            <DateRangePicker
                                onDateRangeChange={handleDateRangeChange}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}