// src/components/dashboard/admin-dashboard/AdminDashboard.tsx

import React from "react";
import DashboardAppointments from "@/components/dashboard/ui/DashboardAppointments";
import AppointmentsTodayCard from "../ui/AppointmentsTodayCard";
import AvailableBedsCard from "../ui/AvailableBedsCard";
import AvailableDoctorsCard from "../ui/AvailableDoctorsCard";
import InwardReferralsCard from "../ui/InwardReferralsCard";
import LearnMoreCard from "../ui/LearnMoreCard";
import OutwardReferralsCard from "../ui/OutwardReferralsCard";
import PatientsGraphCard from "../ui/PatientsGraphCard";
import PatientsTodayCard from "../ui/PatientsTodayCard";
import TopDoctorsCard from "../ui/TopDoctorsCard";
import ServicesDataCard from "../ui/ServicesDataCard";
import { Role, Appointment } from "@/lib/definitions";

interface DashboardProps {
    session: {
        user: {
            userId: string;
            username: string;
            role: Role;
            hospitalId: number | null;
        };
    };
    appointmentsResponse: {
        appointments: Appointment[];
        totalAppointments: number;
    };
    appointmentsOverview: {
        appointmentsToday: number;
        percentageChange: number | null;
    };
    patientsOverview: {
        patientsToday: number;
        percentageChange: number | null;
    };
    availableBedsCount: number;
    onlineDoctorsCount: number;
    inwardReferralsOverview: {
        inwardReferralsToday: number;
        percentageChange: number | null;
        patientDelta: number;
    };
    outwardReferralsOverview: {
        outwardReferralsToday: number;
        percentageChange: number | null;
        patientDelta: number;
    };
    topDoctors: any[];
}

const AdminDashboard: React.FC<DashboardProps> = ({
    session,
    appointmentsResponse,
    appointmentsOverview,
    patientsOverview,
    availableBedsCount,
    onlineDoctorsCount,
    inwardReferralsOverview,
    outwardReferralsOverview,
    topDoctors,
}) => {
    const firstName = session?.user?.username?.split(" ")[0] || "Admin";

    const transformedAppointments = appointmentsResponse.appointments.map(
        (appointment) => ({
            appointmentDate: new Date(
                appointment.appointmentDate
            ).toISOString(),
            hospitalId: appointment.hospitalId,
            patientId: appointment.patientId,
        })
    );

    return (
        <>
            <div className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold p-4 mx-4 rounded-[10px] bg-slate">
                Welcome, {firstName}
            </div>

            <div className="grid xl:flex">
                <div className="grid w-full">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-4">
                        <AvailableDoctorsCard
                            session={session}
                            onlineDoctorsCount={onlineDoctorsCount}
                        />
                        <AvailableBedsCard
                            availableBedsCount={availableBedsCount}
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-4">
                        <AppointmentsTodayCard
                            appointmentsTodayCount={
                                appointmentsOverview.appointmentsToday
                            }
                            percentageChange={
                                appointmentsOverview.percentageChange
                            }
                        />
                        <PatientsTodayCard
                            uniquePatientsTodayCount={
                                patientsOverview.patientsToday
                            }
                            percentageChange={
                                patientsOverview.percentageChange
                            }
                        />
                    </div>
                </div>
                <div className="grid w-full">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 p-4">
                        <OutwardReferralsCard
                            outwardReferralsToday={
                                outwardReferralsOverview.outwardReferralsToday
                            }
                            percentageChange={
                                outwardReferralsOverview.percentageChange
                            }
                            patientDelta={
                                outwardReferralsOverview.patientDelta
                            }
                        />
                        <InwardReferralsCard
                            inwardReferralsToday={
                                inwardReferralsOverview.inwardReferralsToday
                            }
                            percentageChange={
                                inwardReferralsOverview.percentageChange
                            }
                            patientDelta={
                                inwardReferralsOverview.patientDelta
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:flex">
                <div className="flex w-full xl:grid xl:w-1/2 p-4">
                    <PatientsGraphCard
                        session={session}
                        appointments={transformedAppointments}
                    />
                </div>
                <div className="flex w-full xl:grid xl:w-1/2 p-4">
                    <ServicesDataCard session={session} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:flex xl:flex-row w-full h-full mt-4">
                <div className="w-full xl:w-2/3 p-4 xl:pr-2">
                    <DashboardAppointments
                        appointments={appointmentsResponse.appointments}
                        totalAppointments={
                            appointmentsResponse.totalAppointments
                        }
                    />
                </div>
                <div className="flex flex-col w-full xl:w-1/3 p-4 gap-6 h-full">
                    <div>
                        <TopDoctorsCard topDoctors={topDoctors} />
                    </div>
                    <div>
                        <LearnMoreCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;
