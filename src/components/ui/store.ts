// src/components/ui/store.ts file

import { create }from "zustand";

interface Appointment {
    appointmentId: string;
    status: string;
    [key: string]: any;
}

interface AppointmentsState {
    appointments: Appointment[];
    fetchAppointments: () => Promise<void>;
    updateAppointment: (
        appointmentId: string,
        data: Partial<Appointment>
    ) => Promise<void>;
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
    appointments: [],
    fetchAppointments: async () => {
        const response = await fetch("/api/appointments");
        const data = await response.json();
        set({ appointments: data });
    },
    updateAppointment: async (
        appointmentId: string,
        data: Partial<Appointment>
    ) => {
        const response = await fetch(`/api/appointments/${appointmentId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            set((state) => ({
                appointments: Array.isArray(state.appointments) 
                    ? state.appointments.map((appointment) =>
                        appointment.appointmentId === appointmentId
                            ? { ...appointment, ...data }
                            : appointment
                    )
                    : [],
            }));
        } else {
            throw new Error("Failed to update appointment");
        }
    },
}));
