// src/components/appointments/AppointmentList.tsx

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Appointment, Session, Hospital } from "@/lib/definitions";
import AppointmentFilters from "./../appointments/ui/AppointmentsFilters";
import AppointmentRow from "./../appointments/ui/AppointmentRow";
import AppointmentsPagination from "./../appointments/ui/AppointmentsPagination";
import RescheduleDialog from "@/components/appointments/RescheduleDialog";
import CancelDialog from "@/components/appointments/CancelDialog";
import PendingDialog from "@/components/appointments/PendingDialog";
import { updateAppointmentStatus, updateAppointmentType } from "@/lib/data-access/appointments/data";

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
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);
    const [typeText, setTypeText] = useState<{ [key: string]: string }>({});
    const [actionText, setActionText] = useState<{ [key: string]: string }>({});
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogType, setDialogType] = useState<string | undefined>(undefined);
    const [dialogAppointmentId, setDialogAppointmentId] = useState<string | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState("");

    // Initialize typeText mapping whenever appointments/page changes
    useEffect(() => {
        const initialTypeText = appointments.reduce((acc, appointment) => {
            acc[appointment.appointmentId] = appointment.type;
            return acc;
        }, {} as { [key: string]: string });
        setTypeText(initialTypeText);
    }, [appointments, currentPage]);

    // Handler to update appointment type
    const handleUpdateAppointmentType = async (appointmentId: string, newType: string) => {
        setTypeText((prev) => ({ ...prev, [appointmentId]: newType }));

        const { success, updatedType } = await updateAppointmentType(appointmentId, newType);

        if (!success) {
            console.error("Failed to update appointment type");
            setTypeText((prev) => ({
                ...prev,
                [appointmentId]: appointments.find((a) => a.appointmentId === appointmentId)?.type || newType,
            }));
        } else if (updatedType) {
            setFilteredAppointments((prevAppointments) =>
                prevAppointments.map((appointment) =>
                    appointment.appointmentId === appointmentId
                        ? { ...appointment, type: updatedType }
                        : appointment
                )
            );
        }
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
    const handleUpdateStatus = async (appointmentId: string, status: string, reason?: string) => {
        try {
            const updatedAppointment = await updateAppointmentStatus(appointmentId, {
                status,
                reason: reason || "",
            });
            if (updatedAppointment) {
                handleActionChange(appointmentId, status);
            }
        } catch (error) {
            console.error(`Failed to update status for ${appointmentId}:`, error);
        }
    };

    // Handle action change for dropdown actions
    const handleActionChange = (appointmentId: string, action: string) => {
        setActionText((prev) => ({ ...prev, [appointmentId]: action }));
    
        // Update the background for the 'Cancelled' option
        setFilteredAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment.appointmentId === appointmentId
                    ? { ...appointment, status: action }
                    : appointment
            )
        );
    };

    // Filtered appointments based on search term
    const searchFilteredAppointments = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return filteredAppointments.filter((appointment) => {
            const patientName = appointment.patient?.name?.toLowerCase() || ""; // Optional chaining for patient.name
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

    const totalPages = Math.ceil(searchFilteredAppointments.length / ITEMS_PER_PAGE);

    // Handle page change for pagination component
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        setFilteredAppointments(appointments);
    }, [appointments]);

    return (
        <div className="flex-grow">
            <AppointmentFilters
                appointments={appointments}
                session={session}
                hospitals={hospitals}
                onFilterChange={(filtered) => setFilteredAppointments(filtered)}
                onSetAppointments={setFilteredAppointments}
            />

            <div className="overflow-x-auto w-full scrollbar-custom  min-h-[1000px]">
                <table className="min-w-full w-full border-collapse divide-y divide-gray-200 mt-2 table-auto">
                    <thead className="bg-bluelight">
                        <tr>
                            <th className="rounded-tl-2xl px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider">
                                Patient Name
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Age
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Id
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Time
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Doctor&apos;s Name
                            </th>
                            <th className="px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Type
                            </th>
                            <th className="rounded-tr-2xl px-2 py-5 text-center text-sm font-bold text-black uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
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
                            onRescheduleSuccess={(updatedAppointment) =>
                                setFilteredAppointments((prevAppointments) =>
                                    prevAppointments.map((appointment) =>
                                        appointment.appointmentId ===
                                        updatedAppointment.appointmentId
                                            ? updatedAppointment
                                            : appointment
                                    )
                                )
                            }
                            handleActionChange={handleActionChange}
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