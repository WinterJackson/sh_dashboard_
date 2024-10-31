// File: src/components/appointments/AppointmentsTable.tsx

"use client";

import React, { useState, useEffect } from "react";
import { Appointment } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePicker } from "@/components/appointments/DatePicker";
import { DateRangePicker } from "@/components/appointments/DateRangePicker";
import { DateRange } from "react-day-picker";
import { SymbolIcon } from "@radix-ui/react-icons";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useRouter } from "next/navigation";
import { useSearch } from "@/app/context/SearchContext";
import {
    fetchAppointments,
    fetchAppointmentsByHospital,
    updateAppointmentStatus,
    updateAppointmentType,
} from "@/lib/data";
import dynamic from "next/dynamic";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import PlaceIcon from "@mui/icons-material/Place";
import { differenceInYears } from "date-fns";
import {
    Pagination,
    PaginationItem,
    PaginationContent,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";

// Dynamic imports for dialogs
const RescheduleDialog = dynamic(
    () => import("@/components/appointments/RescheduleDialog")
);
const CancelDialog = dynamic(
    () => import("@/components/appointments/CancelDialog")
);
const ActionDialog = dynamic(
    () => import("@/components/appointments/PendingDialog")
);

const filterOptions = [
    { value: "", label: "Filter By" },
    { value: "Patient Name", label: "Patient Name" },
    { value: "Age", label: "Age" },
    { value: "Id", label: "Id" },
    { value: "Date", label: "Date" },
    { value: "Doctor", label: "Doctor" },
    { value: "Type", label: "Type" },
];

interface AppointmentsTableProps {
    appointments: Appointment[];
    totalAppointments: number;
    currentPage: number;
}

const ITEMS_PER_PAGE = 15;

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
    appointments = [],
    totalAppointments,
    currentPage,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [filterType, setFilterType] = useState<string>(
        filterOptions[0].value
    );
    const [statusFilter, setStatusFilter] = useState<string | undefined>(
        undefined
    );
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
    const [dateRangeFilter, setDateRangeFilter] = useState<
        DateRange | undefined
    >(undefined);
    const [appointmentTypeFilter, setAppointmentTypeFilter] = useState<
        string | undefined
    >(undefined);
    const { searchTerm, clearSearchTerm } = useSearch();
    const [actionText, setActionText] = useState<{ [key: string]: string }>({});
    const [typeText, setTypeText] = useState<{ [key: string]: string }>(() =>
        appointments.reduce((acc, appointment) => {
            acc[appointment.appointmentId] = appointment.type;
            return acc;
        }, {} as { [key: string]: string })
    );
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<string | undefined>(undefined);
    const [dialogAppointmentId, setDialogAppointmentId] = useState<
        string | undefined
    >(undefined);
    const [page, setPage] = useState(currentPage || 1);
    const router = useRouter();

    const handleFilterTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFilterType(e.target.value);
        setStatusFilter(undefined);
        setDateFilter(undefined);
        setDateRangeFilter(undefined);
        setAppointmentTypeFilter(undefined);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
    };

    const handleRefresh = () => {
        setFilterType(filterOptions[0].value);
        setStatusFilter(undefined);
        setDateFilter(undefined);
        setDateRangeFilter(undefined);
        setAppointmentTypeFilter(undefined);
        clearSearchTerm();
    };

    const handleActionChange = (appointmentId: string, action: string) => {
        setActionText((prevState) => ({
            ...prevState,
            [appointmentId]: action,
        }));
    };

    const handleDialogOpen = (type: string, appointmentId: string) => {
        setDialogType(type);
        setDialogAppointmentId(appointmentId);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setDialogType(undefined);
        setDialogAppointmentId(undefined);
        setOpenDialog(false);
    };

    const handleCancelSave = async (appointmentId: string, reason: string) => {
        await updateAppointmentStatus(appointmentId, {
            status: "Cancelled",
            reason,
        });
        handleActionChange(appointmentId, "Cancelled");
    };

    const handlePendingSave = async (appointmentId: string, reason: string) => {
        await updateAppointmentStatus(appointmentId, {
            status: "Pending",
            reason,
        });
        handleActionChange(appointmentId, "Pending");
    };

    const handleUpdateStatus = async (
        appointmentId: string,
        status: string
    ) => {
        try {
            const response = await fetch(
                `${process.env.API_URL}/appointments/${appointmentId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Error updating appointment: ${response.statusText}`
                );
            }

            handleActionChange(appointmentId, status);
        } catch (error) {
            console.error("Failed to update appointment status:", error);
        }
    };

    const filteredAppointments = appointments.filter((appointment) => {
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
                case "Id":
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
                        filterMatch =
                            appointment.type === appointmentTypeFilter;
                    }
                    break;
                default:
                    filterMatch =
                        appointment.patient.name
                            .toLowerCase()
                            .includes(searchTextLower) ||
                        (appointment.patient.dateOfBirth &&
                            differenceInYears(
                                new Date(),
                                new Date(appointment.patient.dateOfBirth)
                            )
                                .toString()
                                .includes(searchTextLower)) ||
                        appointment.patient.patientId
                            .toString()
                            .includes(searchTextLower) ||
                        new Date(appointment.appointmentDate)
                            .toLocaleDateString()
                            .includes(searchTextLower) ||
                        appointment.doctor.user.username
                            .toLowerCase()
                            .includes(searchTextLower) ||
                        appointment.type
                            .toLowerCase()
                            .includes(searchTextLower);
                    break;
            }
        }

        if (statusFilter) {
            filterMatch =
                filterMatch &&
                (statusFilter === "Confirmed" ||
                    statusFilter === "Completed" ||
                    statusFilter === "Rescheduled") ===
                    (appointment.status === "Confirmed" ||
                        appointment.status === "Completed" ||
                        appointment.status === "Rescheduled");
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

        if (appointmentTypeFilter) {
            filterMatch =
                filterMatch && appointment.type === appointmentTypeFilter;
        }

        return filterMatch;
    });

    const totalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            router.replace(`?page=${newPage}`);
        }
    };

    // const handleUpdateAppointmentType = async (
    //     appointmentId: string,
    //     type: string
    // ) => {
    //     // Optimistically update the UI immediately to reflect the selection
    //     setTypeText((prev) => ({
    //         ...prev,
    //         [appointmentId]: type, // Set the new selected type for the specific appointment
    //     }));

    //     try {
    //         // Send the PATCH request to update the type in the backend
    //         const response = await fetch(`${process.env.API_URL}/appointments/${appointmentId}`, {
    //             method: "PATCH",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ type }),
    //         });

    //         if (!response.ok) {
    //             throw new Error(
    //                 `Error updating appointment type: ${response.statusText}`
    //             );
    //         }

    //     } catch (error) {
    //         console.error("Failed to update appointment type:", error);
    //     }
    // };

    // Function to handle appointment type update
    const handleUpdateAppointmentType = async (
        appointmentId: string,
        newType: string
    ) => {
        // Optimistically update the UI to reflect the selection
        setTypeText((prev) => ({
            ...prev,
            [appointmentId]: newType,
        }));

        // Attempt backend update
        const { success, updatedType } = await updateAppointmentType(
            appointmentId,
            newType
        );

        // If update fails, revert to the previous state
        if (!success) {
            console.error("Failed to update appointment type");
            setTypeText((prev) => ({
                ...prev,
                [appointmentId]:
                    appointments.find((a) => a.appointmentId === appointmentId)
                        ?.type || newType,
            }));
        } else if (updatedType) {
            // Confirmed update from the backend
            setTypeText((prev) => ({
                ...prev,
                [appointmentId]: updatedType,
            }));
        }
    };

    // Render pages with ellipsis
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 7) {
            // Show all pages if total pages are less than 7
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            if (page > 4) pages.push("..."); // Ellipsis after the first page

            // Show two pages before and after current page
            for (
                let i = Math.max(2, page - 2);
                i <= Math.min(totalPages - 1, page + 2);
                i++
            ) {
                pages.push(i);
            }

            if (page < totalPages - 3) pages.push("..."); // Ellipsis before the last page

            // Always show the last page
            pages.push(totalPages);
        }
        return pages;
    };

    useEffect(() => {
        // Update typeText state with the current appointment types for the current page
        const initialTypeText = appointments.reduce((acc, appointment) => {
            acc[appointment.appointmentId] = appointment.type;
            return acc;
        }, {} as { [key: string]: string });
        setTypeText(initialTypeText);
    }, [appointments, page]);

    return (
        <div className="flex flex-col min-w-full">
            <button
                onClick={handleRefresh}
                title="Refresh List"
                className="p-1 rounded-[10px] h-[35px] w-[90px] gap-2 font-semibold text-white shadow-xl bg-primary hover:text-black hover:shadow-none hover:bg-bluelight flex items-center justify-between"
            >
                <SymbolIcon className="h-4 w-4" />
                <span className="text-xs pr-1">Refresh</span>
            </button>

            <div className="flex flex-row justify-between items-center mb-1 mt-3">
                <div className="flex flex-row items-center gap-4">
                    <select
                        className="flex-grow p-2 px-2 py-2 border-gray-300 rounded-[10px] h-10 w-auto max-w-[120px] bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary"
                        value={filterType}
                        onChange={handleFilterTypeChange}
                    >
                        {filterOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <button
                        className={`flex-grow px-4 py-2 border-primary rounded-[10px] h-10 text-nowrap w-auto font-semibold text-black shadow-sm shadow-primary hover:bg-primary hover:text-white hover:shadow-none ${
                            statusFilter === "Confirmed" ||
                            statusFilter === "Completed"
                                ? "bg-primary text-white"
                                : ""
                        }`}
                        onClick={() => handleStatusFilter("Confirmed")}
                    >
                        Approved Appointments
                    </button>
                    <button
                        className={`flex-grow px-4 py-2 border-primary rounded-[10px] h-10 text-nowrap w-auto font-semibold text-black shadow-sm shadow-primary hover:bg-primary hover:text-white hover:shadow-none ${
                            statusFilter === "Unconfirmed"
                                ? "bg-primary text-white"
                                : ""
                        }`}
                        onClick={() => handleStatusFilter("Unconfirmed")}
                    >
                        Other Appointments
                    </button>
                    {filterType === "Type" && (
                        <>
                            <button
                                className={`flex-grow px-4 py-2 border-primary rounded-[10px] h-10 text-nowrap w-auto font-semibold text-black shadow-sm shadow-primary hover:bg-primary hover:text-white hover:shadow-none ${
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
                                className={`flex-grow px-4 py-2 border-primary rounded-[10px] h-10 text-nowrap w-auto font-semibold text-black shadow-sm shadow-primary hover:bg-primary hover:text-white hover:shadow-none ${
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
                            <DatePicker onDateChange={setDateFilter} />
                            <DateRangePicker
                                onDateRangeChange={setDateRangeFilter}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto w-full">
                <table className="min-w-full w-full border-collapse divide-y divide-gray-200 mt-2 table-auto">
                    <thead className="bg-bluelight">
                        <tr>
                            <th
                                scope="col"
                                className="px-4 py-5 text-nowrap text-left text-sm font-bold text-black uppercase tracking-wider white-space: nowrap"
                            >
                                Patient Name
                            </th>
                            <th
                                scope="col"
                                className="px-2 py-5 text-nowrap text-center text-sm font-bold text-black uppercase tracking-wider white-space: nowrap"
                            >
                                Age
                            </th>
                            <th
                                scope="col"
                                className="px-2 py-5 text-nowrap text-center text-sm font-bold text-black uppercase tracking-wider white-space: nowrap"
                            >
                                Id
                            </th>
                            <th
                                scope="col"
                                className="px-2 py-5 text-nowrap text-center text-sm font-bold text-black uppercase tracking-wider white-space: nowrap"
                            >
                                Time
                            </th>
                            <th
                                scope="col"
                                className="px-2 py-5 text-nowrap text-center text-sm font-bold text-black uppercase tracking-wider white-space: nowrap"
                            >
                                Date
                            </th>
                            <th
                                scope="col"
                                className="px-2 py-5 text-nowrap text-center text-sm font-bold text-black uppercase tracking-wider white-space: nowrap"
                            >
                                Doctor&apos;s Name
                            </th>
                            <th
                                scope="col"
                                className="px-2 py-5 text-nowrap text-center text-sm font-bold text-black uppercase tracking-wider white-space: nowrap"
                            >
                                Type
                            </th>
                            <th
                                scope="col"
                                className="px-2 py-5 text-nowrap text-center text-sm font-bold text-black uppercase tracking-wider white-space: nowrap"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading
                            ? Array.from({ length: 15 }).map((_, index) => (
                                  <tr key={index}>
                                      <td colSpan={8}>
                                          <Skeleton
                                              className={`h-[45px] w-full p-4 rounded-sm py-4`}
                                          />
                                      </td>
                                  </tr>
                              ))
                            : filteredAppointments.map((appointment) => {
                                  const appointmentDate = new Date(
                                      appointment.appointmentDate
                                  );
                                  const formattedDate =
                                      appointmentDate.toLocaleDateString();
                                  const formattedTime =
                                      appointmentDate.toLocaleTimeString();

                                  const currentStatus =
                                      actionText[appointment.appointmentId] ||
                                      appointment.status;
                                  const isCancelled =
                                      currentStatus === "Cancelled";

                                  const rowClass = isCancelled
                                      ? "bg-red-100"
                                      : "bg-white";

                                  return (
                                      <tr
                                          key={appointment.appointmentId}
                                          className={`text-center ${rowClass}`}
                                      >
                                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-left">
                                              {appointment.patient.name}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                              {appointment.patient.dateOfBirth
                                                  ? differenceInYears(
                                                        new Date(),
                                                        new Date(
                                                            appointment.patient.dateOfBirth
                                                        )
                                                    )
                                                  : "N/A"}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                              {appointment.patient.patientId}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                              {formattedTime}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                              {formattedDate}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                              {(() => {
                                                  console.log(
                                                      "Doctor info:",
                                                      appointment.doctor?.user
                                                          ?.profile
                                                  );
                                                  const firstName =
                                                      appointment.doctor?.user
                                                          ?.profile?.firstName;
                                                  const lastName =
                                                      appointment.doctor?.user
                                                          ?.profile?.lastName;
                                                  return firstName && lastName
                                                      ? `Dr. ${firstName} ${lastName}`
                                                      : "N/A";
                                              })()}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                              <DropdownMenu>
                                                  <DropdownMenuTrigger className="flex w-auto justify-center p-1 border-gray-300 rounded-[5px] max-w-[120px] bg-gray-100 text-gray-700">
                                                      <span className="flex gap-1 items-center">
                                                          {typeText[
                                                              appointment
                                                                  .appointmentId
                                                          ] === "Virtual" ? (
                                                              <VideoCameraFrontIcon className="text-primary" />
                                                          ) : (
                                                              <PlaceIcon className="text-black/70" />
                                                          )}
                                                          <span>
                                                              {
                                                                  typeText[
                                                                      appointment
                                                                          .appointmentId
                                                                  ]
                                                              }
                                                          </span>
                                                          <ArrowDropDownIcon className="ml-1 text-gray-500" />
                                                      </span>
                                                  </DropdownMenuTrigger>
                                                  <DropdownMenuContent className=" rounded-[10px] shadow-md p-2">
                                                  <DropdownMenuItem
                                                          onSelect={() =>
                                                              handleUpdateAppointmentType(
                                                                  appointment.appointmentId,
                                                                  "Virtual"
                                                              )
                                                          }
                                                          className="p-2 rounded-[5px]"
                                                      >
                                                          <VideoCameraFrontIcon className="text-black/70 mr-2" />
                                                          Virtual
                                                      </DropdownMenuItem>
                                                      <DropdownMenuItem
                                                          onSelect={() =>
                                                              handleUpdateAppointmentType(
                                                                  appointment.appointmentId,
                                                                  "Walk In"
                                                              )
                                                          }
                                                          className="p-2 rounded-[5px]"
                                                      >
                                                          <PlaceIcon className="text-black/70 mr-2" />
                                                          Walk In
                                                      </DropdownMenuItem>
                                                  </DropdownMenuContent>
                                              </DropdownMenu>
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                              <div className="flex justify-center">
                                                  <DropdownMenu>
                                                      <DropdownMenuTrigger className="flex w-auto justify-center p-1 border-gray-300 rounded max-w-[120px] bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary">
                                                          <span className="flex gap-1">
                                                              <span className="pl-2">
                                                                  {actionText[
                                                                      appointment
                                                                          .appointmentId
                                                                  ] ||
                                                                      appointment.status ||
                                                                      "Action"}
                                                              </span>
                                                              <ArrowDropDownIcon />
                                                          </span>
                                                      </DropdownMenuTrigger>
                                                      <DropdownMenuContent className=" rounded-[10px] shadow-md p-2">
                                                      <DropdownMenuItem
                                                              onSelect={() => {
                                                                  handleDialogOpen(
                                                                      "Reschedule",
                                                                      appointment.appointmentId
                                                                  );
                                                              }}
                                                              className="p-2 rounded-[5px]"
                                                          >
                                                              Reschedule
                                                          </DropdownMenuItem>
                                                          <DropdownMenuItem
                                                              onSelect={() => {
                                                                  handleDialogOpen(
                                                                      "Cancel",
                                                                      appointment.appointmentId
                                                                  );
                                                              }}
                                                              className="p-2 rounded-[5px]"
                                                          >
                                                              Cancel
                                                          </DropdownMenuItem>
                                                          <DropdownMenuItem
                                                              onSelect={() => {
                                                                  handleDialogOpen(
                                                                      "Pending",
                                                                      appointment.appointmentId
                                                                  );
                                                              }}
                                                              className="p-2 rounded-[5px]"
                                                          >
                                                              Pending
                                                          </DropdownMenuItem>
                                                          <DropdownMenuItem
                                                              onSelect={() => {
                                                                  handleUpdateStatus(
                                                                      appointment.appointmentId,
                                                                      "Confirmed"
                                                                  );
                                                              }}
                                                              className="p-2 rounded-[5px]"
                                                          >
                                                              Confirm
                                                          </DropdownMenuItem>
                                                          <DropdownMenuItem
                                                              onSelect={() => {
                                                                  handleUpdateStatus(
                                                                      appointment.appointmentId,
                                                                      "Completed"
                                                                  );
                                                              }}
                                                              className="p-2 rounded-[5px]"
                                                          >
                                                              Completed
                                                          </DropdownMenuItem>
                                                      </DropdownMenuContent>
                                                  </DropdownMenu>
                                              </div>
                                          </td>
                                      </tr>
                                  );
                              })}
                    </tbody>
                </table>
            </div>

            <Pagination className="mt-4 bg-bluelight p-4 rounded-b-2xl">
                <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded-[10px] mr-4 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Previous
                </PaginationPrevious>

                <PaginationContent className="flex items-center gap-2">
                    {getPageNumbers().map((pageNumber, index) =>
                        pageNumber === "..." ? (
                            <PaginationEllipsis
                                key={index}
                                className="px-3 py-1 text-gray-500"
                            >
                                ...
                            </PaginationEllipsis>
                        ) : (
                            <PaginationItem
                                key={index}
                                isActive={pageNumber === page}
                                onClick={() =>
                                    handlePageChange(Number(pageNumber))
                                }
                                className={`px-3 py-1 rounded-[10px] cursor-pointer transition-colors ${
                                    pageNumber === page
                                        ? "bg-primary text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-blue-200"
                                }`}
                            >
                                {pageNumber}
                            </PaginationItem>
                        )
                    )}
                </PaginationContent>

                <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded-[10px] ml-4 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
                >
                    Next
                </PaginationNext>
            </Pagination>

            {openDialog && dialogType && dialogAppointmentId && (
                <>
                    {dialogType === "Reschedule" && dialogAppointmentId && (
                        <RescheduleDialog
                            appointmentId={dialogAppointmentId}
                            onClose={handleDialogClose}
                            handleActionChange={handleActionChange}
                        />
                    )}
                    {dialogType === "Cancel" && dialogAppointmentId && (
                        <CancelDialog
                            appointmentId={dialogAppointmentId}
                            onSave={(reason) =>
                                handleCancelSave(dialogAppointmentId, reason)
                            }
                            onClose={handleDialogClose}
                        />
                    )}
                    {dialogType === "Pending" && dialogAppointmentId && (
                        <ActionDialog
                            appointmentId={dialogAppointmentId}
                            action="Pending"
                            onSave={(reason) =>
                                handlePendingSave(dialogAppointmentId, reason)
                            }
                            onClose={handleDialogClose}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default AppointmentsTable;
