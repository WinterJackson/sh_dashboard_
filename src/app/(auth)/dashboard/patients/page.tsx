// src/app/(auth)/dashboard/patients/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "next/link";
import { Patient, Hospital } from "@/lib/definitions";
import { fetchPatientsByRole, fetchAllHospitals } from "@/lib/data";
import { useSessionData } from "@/hooks/useSessionData";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useSearch } from "@/app/context/SearchContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SymbolIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 15;

export default function PatientsPage() {
    const [showOptions, setShowOptions] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [totalPatients, setTotalPatients] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterType, setFilterType] = useState<string | null>("Filter By");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
        null
    );
    const session = useSessionData();
    const { searchTerm, setSearchTerm } = useSearch();

    const totalPages = Math.ceil(totalPatients / ITEMS_PER_PAGE);

    useEffect(() => {
        const loadHospitals = async () => {
            const hospitalsData = await fetchAllHospitals();
            setHospitals(hospitalsData);
        };
        loadHospitals();
    }, []);

    useEffect(() => {
        const loadPatients = async () => {
            const user = session?.user;
            if (user) {
                const patientsData = await fetchPatientsByRole(user);
                setPatients(patientsData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE));
                setTotalPatients(patientsData.length);
            }
        };
        loadPatients();
    }, [session, currentPage]);

    const getLastAppointment = (
        appointments: Patient["appointments"] | undefined
    ) => {
        if (!appointments || appointments.length === 0) return null;
        const pastAppointments = appointments.filter(
            (appt) => new Date(appt.appointmentDate) < new Date()
        );
        return pastAppointments.length > 0
            ? pastAppointments.reduce((latest, appt) =>
                  new Date(appt.appointmentDate) >
                  new Date(latest.appointmentDate)
                      ? appt
                      : latest
              )
            : null;
    };

    const getNextAppointment = (
        appointments: Patient["appointments"] | undefined
    ) => {
        if (!appointments || appointments.length === 0) return null;
        const futureAppointments = appointments.filter(
            (appt) => new Date(appt.appointmentDate) > new Date()
        );
        return futureAppointments.length > 0
            ? futureAppointments.reduce((earliest, appt) =>
                  new Date(appt.appointmentDate) <
                  new Date(earliest.appointmentDate)
                      ? appt
                      : earliest
              )
            : null;
    };

    const filterPatients = () => {
        return patients.filter((patient) => {
            const term = searchTerm.toLowerCase();
            switch (filterType) {
                case "Reg No":
                    return patient.patientId.toString().includes(term);
                case "Hospital":
                    return (
                        session?.user?.role === "SUPER_ADMIN" &&
                        patient.hospitalId === selectedHospitalId
                    );
                case "Name":
                    return patient.name.toLowerCase().includes(term);
                case "Phone No":
                    return patient.phoneNo.includes(term);
                case "Email":
                    return patient.email.toLowerCase().includes(term);
                case "Date of Birth":
                    return selectedDate
                        ? new Date(patient.dateOfBirth).toLocaleDateString() ===
                              selectedDate.toLocaleDateString()
                        : true;
                case "Gender":
                    return term === "other"
                        ? !["male", "female"].includes(
                              patient.gender.toLowerCase()
                          )
                        : patient.gender.toLowerCase() === term;
                default:
                    return true;
            }
        });
    };

    const handleFilterSelection = (type: string) => {
        setFilterType(type);
        setSearchTerm(""); // Clear previous search term
        setSelectedHospitalId(null); // Clear hospital filter
    };

    const handleDateSelect = (date: Date | null) => {
        setSelectedDate(date);
        setSearchTerm(date ? date.toLocaleDateString() : "");
    };

    const handleHospitalSelect = (hospitalId: number) => {
        setFilterType("Hospital");
        setSelectedHospitalId(hospitalId);
        setSearchTerm(""); // Clear previous search term
    };

    const handleGenderSelect = (gender: string) => {
        setFilterType("Gender");
        setSearchTerm(gender.toLowerCase());
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="flex flex-col gap-4 p-3">
            <h1 className="text-xl font-bold">Patients</h1>

            <div className="flex gap-5 items-center p-3 pl-0">
                {/* Filter By Dropdown */}
                <DropdownMenu onOpenChange={setShowOptions}>
                    <DropdownMenuTrigger asChild>
                        <button className="flex whitespace-nowrap items-center justify-between gap-3 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[10px] h-15 w-auto max-w-[150px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary">
                            {filterType}
                            <ChevronRightIcon
                                className={`ml-auto text-xl transform transition-transform duration-300 ${
                                    showOptions ? "rotate-90" : ""
                                }`}
                            />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="fixed bg-white rounded-xl shadow-md p-2 w-44 mt-1">
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                                onClick={() => handleFilterSelection("Reg No.")}
                                className="flex justify-between items-center rounded-[5px]"
                            >
                                Reg No.
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-3 ml-4 max-w-[160px]">
                                <p className="text-sm text-gray-500">
                                    Select the Reg No. option and type the
                                    patient&apos;s ID in the search bar then
                                    press Enter.
                                </p>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        {session?.user?.role === "SUPER_ADMIN" && (
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="flex justify-between items-center rounded-[5px]">
                                    Hospital
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-3 ml-4">
                                    {hospitals.map((hospital) => (
                                        <DropdownMenuItem
                                            key={hospital.hospitalId}
                                            onClick={() =>
                                                handleHospitalSelect(
                                                    hospital.hospitalId
                                                )
                                            }
                                            className="flex rounded-[5px]"
                                        >
                                            {hospital.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        )}

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                                onClick={() => handleFilterSelection("Name")}
                                className="flex justify-between items-center rounded-[5px]"
                            >
                                Name
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-3 ml-4 max-w-[150px]">
                                <p className="text-sm text-gray-500">
                                    Select the Name option and type the
                                    patient&apos;s Name in the search bar then
                                    press Enter.
                                </p>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                                onClick={() =>
                                    handleFilterSelection("Phone No.")
                                }
                                className="flex justify-between items-center rounded-[5px]"
                            >
                                Phone No.
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-3 ml-4 max-w-[150px]">
                                <p className="text-sm text-gray-500">
                                    Select the Phone No. option and type the
                                    patient&apos;s Phone Number in the search
                                    bar then press Enter.
                                </p>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                                onClick={() => handleFilterSelection("Email")}
                                className="flex justify-between items-center rounded-[5px]"
                            >
                                Email
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-3 ml-4 max-w-[150px]">
                                <p className="text-sm text-gray-500">
                                    Select the Email option and type the
                                    patient&apos;s Email in the search bar then
                                    press Enter.
                                </p>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger
                                onClick={() =>
                                    handleFilterSelection("Date of Birth")
                                }
                                className="flex justify-between items-center rounded-[5px]"
                            >
                                Date of Birth
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-2 ml-4 max-w-[260px]">
                                <DatePicker
                                    selected={selectedDate || undefined}
                                    onChange={handleDateSelect}
                                    className="w-full p-2 text-sm border border-primary rounded-md"
                                    placeholderText="Select Date: MM/DD/YYYY"
                                    calendarClassName="custom-datepicker"
                                />
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="flex justify-between items-center rounded-[5px]">
                                Gender
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-white rounded-[10px] shadow p-2 ml-4 max-w-[150px]">
                                <DropdownMenuItem
                                    onClick={() => handleGenderSelect("Male")}
                                    className="flex rounded-[5px]"
                                >
                                    Male
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleGenderSelect("Female")}
                                    className="flex rounded-[5px]"
                                >
                                    Female
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleGenderSelect("Other")}
                                    className="flex rounded-[5px]"
                                >
                                    Other
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Last Appointments Button */}
                <button
                    className="flex whitespace-nowrap items-center justify-center gap-2 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[10px] h-15 w-auto text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
                    onClick={() =>
                        setPatients(
                            [...patients].sort((a, b) => {
                                const lastApptA =
                                    a.appointments?.[a.appointments.length - 1];
                                const lastApptB =
                                    b.appointments?.[b.appointments.length - 1];
                                return lastApptB && lastApptA
                                    ? new Date(
                                          lastApptB.appointmentDate
                                      ).getTime() -
                                          new Date(
                                              lastApptA.appointmentDate
                                          ).getTime()
                                    : 0;
                            })
                        )
                    }
                >
                    Last Appointments
                </button>

                {/* Refresh Button */}
                <button
                    className="flex items-center justify-center gap-2 p-3 border-gray-300 shadow-lg shadow-gray-300 rounded-[10px] h-15 w-auto max-w-[120px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
                    onClick={() => {
                        setFilterType("Filter By");
                        setSelectedHospitalId(null);
                        setSearchTerm("");

                        const url = new URL(window.location.href);
                        url.searchParams.delete("query");
                        window.history.replaceState(null, "", url.toString());

                        const loadPatients = async () => {
                            const user = session?.user;
                            if (user) {
                                const patientsData = await fetchPatientsByRole(
                                    user
                                );
                                setPatients(patientsData);
                            }
                        };
                        loadPatients();
                    }}
                >
                    Refresh
                    <SymbolIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="p-1 bg-bluelight/5 rounded-t-2xl">
                <table className="w-full rounded-2xl border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-gray-800">
                            <th className="text-left p-2 w-[8%]">
                                {patients.length} Patients
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
                            <th className="text-center p-2 w-[15%]">
                                Last Appt
                            </th>
                            <th className="text-center p-2 w-[15%]">
                                Next Appt
                            </th>
                            <th className="text-center p-2 w-[15%]">Reason</th>
                            <th className="text-center p-2 w-[2%]"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterPatients().map((patient) => {
                            const lastAppt = getLastAppointment(
                                patient.appointments
                            );
                            const nextAppt = getNextAppointment(
                                patient.appointments
                            );

                            return (
                                <tr
                                    key={patient.patientId}
                                    className="bg-white shadow-md"
                                >
                                    <td className="text-center w-[8%] p-2 rounded-l-[10px]">
                                        <input
                                            type="checkbox"
                                            className="w-[15px] h-[15px]"
                                        />
                                    </td>
                                    <Link
                                        href={`/dashboard/patients/patient-profile`}
                                        className="w-[25%] p-2"
                                    >
                                        <td className="flex items-center gap-4">
                                            <Image
                                                alt="profile pic"
                                                src="/images/img-p4.png"
                                                width="50"
                                                height="50"
                                                className="rounded-full object-cover"
                                            />
                                            <div className="flex flex-col">
                                                <p className="font-semibold capitalize">
                                                    {patient.name}
                                                </p>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <p className="text-sm text-primary truncate max-w-52 sm:max-w-[250px]">
                                                                {patient.email
                                                                    .length > 15
                                                                    ? `${patient.email.slice(
                                                                          0,
                                                                          15
                                                                      )}...`
                                                                    : patient.email}
                                                            </p>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {patient.email}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </td>
                                    </Link>
                                    <td className="text-center w-[15%] p-2 whitespace-nowrap">
                                        {patient.phoneNo}
                                    </td>
                                    <td className="text-center w-[10%] p-2">
                                        {patient.patientId}
                                    </td>
                                    <td className="text-center w-[15%] p-2">
                                        {lastAppt ? (
                                            <>
                                                <p>
                                                    {new Date(
                                                        lastAppt.appointmentDate
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p>
                                                    {new Date(
                                                        lastAppt.appointmentDate
                                                    ).toLocaleTimeString()}
                                                </p>
                                            </>
                                        ) : (
                                            <p>No recent appointment</p>
                                        )}
                                    </td>
                                    <td className="text-center w-[15%] p-2">
                                        {nextAppt ? (
                                            <>
                                                <p>
                                                    {new Date(
                                                        nextAppt.appointmentDate
                                                    ).toLocaleDateString()}
                                                </p>
                                                <p>
                                                    {new Date(
                                                        nextAppt.appointmentDate
                                                    ).toLocaleTimeString()}
                                                </p>
                                            </>
                                        ) : (
                                            <p>No upcoming appointment</p>
                                        )}
                                    </td>
                                    <td className="text-center w-[15%] p-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <p className="truncate max-w-[150px]">
                                                        {patient
                                                            .reasonForConsultation
                                                            .length > 5
                                                            ? `${patient.reasonForConsultation.slice(
                                                                  0,
                                                                  5
                                                              )}...`
                                                            : patient.reasonForConsultation}
                                                    </p>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {
                                                            patient.reasonForConsultation
                                                        }
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </td>
                                    <td className="text-center p-2 rounded-r-[10px]">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button>
                                                    <MoreHorizIcon className="cursor-pointer" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-white rounded-xl shadow-md p-2 w-24 mr-9">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        console.log(
                                                            "Edit patient"
                                                        )
                                                    }
                                                    className="rounded-[5px]"
                                                >
                                                    <DriveFileRenameOutlineIcon className="mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        console.log(
                                                            "Delete patient"
                                                        )
                                                    }
                                                    className="rounded-[5px]"
                                                >
                                                    <DeleteOutlineIcon className="mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Pagination className=" bg-bluelight/5 p-4 rounded-b-2xl">
                <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded-[10px] mr-4 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
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
                    className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded-[10px] ml-4 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Next
                </PaginationNext>
            </Pagination>
        </div>
    );
}
