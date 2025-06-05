 
"use client";

import { Appointment } from "@/lib/definitions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tab";
import PatientAppointmentsTable from "./PatientAppointmentsTable"; // Import the AppointmentTable component

export default function AppointmentsTimeline({
    appointments,
}: {
    appointments: Appointment[];
}) {
    return (
        <div className="bg-white p-4 rounded-[10px] shadow-md w-auto">
            <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upcoming" className="hover:bg-primary hover:text-white p-2 border-r-2 border-gray-400 rounded-l-[10px] bg-black/5">Upcoming Appointments</TabsTrigger>
                    <TabsTrigger value="past" className="hover:bg-primary hover:text-white p-2 rounded-r-[10px] bg-black/5">Past Appointments</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <PatientAppointmentsTable
                        appointments={appointments.filter(
                            (appt) =>
                                new Date(appt.appointmentDate) > new Date()
                        )}
                    />
                </TabsContent>
                <TabsContent value="past">
                    <PatientAppointmentsTable
                        appointments={appointments.filter(
                            (appt) =>
                                new Date(appt.appointmentDate) <= new Date()
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}