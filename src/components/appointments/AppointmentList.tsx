// src/components/appointments/AppointmentList.tsx

"use client";

import CancelDialog from "@/components/appointments/ui/appointment-modals/CancelDialog";
import PendingDialog from "@/components/appointments/ui/appointment-modals/PendingDialog";
import RescheduleDialog from "@/components/appointments/ui/appointment-modals/RescheduleDialog";
import { useUpdateAppointmentStatus } from "@/hooks/useUpdateAppointmentStatus";
import { useUpdateAppointmentType } from "@/hooks/useUpdateAppointmentType";
import { Appointment, Hospital, Role, Session } from "@/lib/definitions";
import { useEffect, useMemo, useState } from "react";
import AppointmentRow from "./ui/appointments-table/AppointmentRow";
import AppointmentsFilters from "./ui/appointments-table/AppointmentsFilters";
import AppointmentsPagination from "./ui/appointments-table/AppointmentsPagination";

const ITEMS_PER_PAGE = 15;

interface AppointmentListProps {
    appointments: Appointment[];
    totalAppointments: number;
    session: Session | null;
    hospitals: Hospital[];
}

export default function AppointmentList({
    appointments,
    session,
    hospitals,
}: AppointmentListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredAppointments, setFilteredAppointments] =
        useState(appointments);
    const [typeText, setTypeText] = useState<{ [key: string]: string }>({});
    const [actionText, setActionText] = useState<{ [key: string]: string }>({});
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<string | undefined>(undefined);
    const [dialogAppointmentId, setDialogAppointmentId] = useState<
        string | undefined
    >(undefined);
    const [searchTerm] = useState("");

    // Initialize hooks for mutations
    const { mutate: updateType } = useUpdateAppointmentType();
    const { mutate: updateStatus } = useUpdateAppointmentStatus();

    // Initialize typeText mapping whenever appointments/page changes
    useEffect(() => {
        const initialTypeText = appointments.reduce((acc, appointment) => {
            acc[appointment.appointmentId] = appointment.type;
            return acc;
        }, {} as { [key: string]: string });
        setTypeText(initialTypeText);
    }, [appointments, currentPage]);

    // Handler to update appointment type
    const handleUpdateAppointmentType = async (
        appointmentId: string,
        newType: string
    ) => {
        setTypeText((prev) => ({ ...prev, [appointmentId]: newType }));

        updateType(
            {
                appointmentId,
                newType,
                user: session?.user
                    ? {
                          role: session.user.role as Role,
                          hospitalId: session.user.hospitalId,
                          userId: session.user.id,
                      }
                    : undefined,
            },
            {
                onSuccess: (updatedType) => {
                    if (updatedType) {
                        setFilteredAppointments((prevAppointments) =>
                            prevAppointments.map((appointment) =>
                                appointment.appointmentId === appointmentId
                                    ? { ...appointment, type: updatedType }
                                    : appointment
                            )
                        );
                    }
                },
                onError: () => {
                    console.error("Failed to update appointment type");
                    setTypeText((prev) => ({
                        ...prev,
                        [appointmentId]:
                            appointments.find(
                                (a) => a.appointmentId === appointmentId
                            )?.type || newType,
                    }));
                },
            }
        );
    };

    // Handler to open dialog
    const handleDialogOpen = (type: string, appointmentId: string) => {
        setDialogType(type);
        setDialogAppointmentId(appointmentId);
        setOpenDialog(true);
    };

    // Handler to close dialog
    const handleDialogClose = () => {
        setDialogType(undefined);
        setDialogAppointmentId(undefined);
        setOpenDialog(false);
    };

    // Handler to update appointment status
    const handleUpdateStatus = async (
        appointmentId: string,
        status: string,
        reason?: string
    ) => {
        // Normalize the status to uppercase to match AppointmentStatus enum
        const normalizedStatus = status.toUpperCase();

        updateStatus(
            {
                appointmentId,
                updateData: { status: normalizedStatus, reason: reason || "" },
                user: session?.user
                    ? {
                          role: session.user.role as Role,
                          hospitalId: session.user.hospitalId,
                          userId: session.user.id,
                      }
                    : undefined,
            },
            {
                onSuccess: (updatedAppointment) => {
                    if (updatedAppointment) {
                        handleActionChange(appointmentId, normalizedStatus); // Use normalized status here
                    }
                },
                onError: (error) => {
                    console.error(
                        `Failed to update status for ${appointmentId}:`,
                        error
                    );
                },
            }
        );
    };

    // Handle action change for dropdown actions
    const handleActionChange = (appointmentId: string, action: string) => {
        setActionText((prev) => ({ ...prev, [appointmentId]: action }));

        setFilteredAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment.appointmentId === appointmentId
                    ? {
                          ...appointment,
                          status: action.toUpperCase() as Appointment["status"],
                      }
                    : appointment
            )
        );
    };

    const updateFilteredAppointments = (updatedAppointment: Appointment) => {
        setFilteredAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment.appointmentId === updatedAppointment.appointmentId
                    ? updatedAppointment
                    : appointment
            )
        );
    };

    // Filtered appointments based on search term
    const searchFilteredAppointments = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return filteredAppointments.filter((appointment) => {
            const patientName = appointment.patient?.user?.profile
                ? `${appointment.patient.user.profile.firstName} ${appointment.patient.user.profile.lastName}`.toLowerCase()
                : "";
            const doctorUsername =
                appointment.doctor?.user?.username?.toLowerCase() || ""; // Optional chaining for doctor.user.username
            return patientName.includes(term) || doctorUsername.includes(term);
        });
    }, [searchTerm, filteredAppointments]);

    // Paginated appointments
    const paginatedAppointments = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return searchFilteredAppointments.slice(start, end);
    }, [searchFilteredAppointments, currentPage]);

    const totalPages = Math.ceil(
        searchFilteredAppointments.length / ITEMS_PER_PAGE
    );

    // Handle page change for pagination component
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setFilteredAppointments(appointments);
    }, [appointments]);

    return (
        <div className="flex-grow">
            <AppointmentsFilters
                appointments={appointments}
                session={session}
                hospitals={hospitals}
                onFilterChange={(filtered) => setFilteredAppointments(filtered)}
                onSetAppointments={setFilteredAppointments}
            />

            <div className="overflow-x-auto w-full scrollbar-custom mt-4">
                <table className="w-full bg-slate-two p-1 rounded-t-2xl border-separate border-spacing-y-4">
                    <thead>
                        <tr className="text-foreground">
                            <th className="text-left p-2 text-[13px]">
                                Patient Name
                            </th>
                            <th className="text-center p-2">Age</th>
                            <th className="text-center p-2">Id</th>
                            <th className="text-center p-2">Time</th>
                            <th className="text-center p-2">Date</th>
                            <th className="text-center p-2 whitespace-nowrap">
                                Doctor&apos;s Name
                            </th>
                            <th className="text-center p-2">Type</th>
                            <th className="text-center p-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedAppointments.map((appointment) => (
                            <AppointmentRow
                                key={appointment.appointmentId}
                                appointment={appointment}
                                typeText={typeText}
                                actionText={actionText}
                                handleUpdateAppointmentType={
                                    handleUpdateAppointmentType
                                }
                                handleDialogOpen={handleDialogOpen}
                                handleUpdateStatus={handleUpdateStatus}
                                handleActionChange={handleActionChange}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <AppointmentsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* Render dialog modals */}
            {openDialog && dialogType && dialogAppointmentId && (
                <>
                    {dialogType === "Reschedule" && (
                        <RescheduleDialog
                            appointmentId={dialogAppointmentId}
                            onClose={handleDialogClose}
                            handleActionChange={handleActionChange}
                            updateFilteredAppointments={
                                updateFilteredAppointments
                            }
                        />
                    )}

                    {dialogType === "Cancel" && (
                        <CancelDialog
                            appointmentId={dialogAppointmentId}
                            onClose={handleDialogClose}
                            onSave={(reason: string) =>
                                handleUpdateStatus(
                                    dialogAppointmentId,
                                    "Cancelled",
                                    reason
                                )
                            }
                            handleActionChange={handleActionChange}
                        />
                    )}

                    {dialogType === "Pending" && (
                        <PendingDialog
                            appointmentId={dialogAppointmentId}
                            onClose={handleDialogClose}
                            onSave={(reason: string | undefined) =>
                                handleUpdateStatus(
                                    dialogAppointmentId,
                                    "Pending",
                                    reason
                                )
                            }
                            handleActionChange={handleActionChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}
