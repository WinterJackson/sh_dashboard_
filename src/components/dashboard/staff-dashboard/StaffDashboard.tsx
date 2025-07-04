// src/components/dashboard/staff-dashboard/StaffDashboard.tsx

import React, { useMemo } from "react";
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

import {
    fetchAppointments,
    fetchAppointmentsOverview,
} from "@/lib/data-access/appointments/data";
import { fetchPatientsOverview } from "@/lib/data-access/patients/data";
import { fetchAvailableBedsCount } from "@/lib/data-access/beds/data";
import {
    fetchOnlineDoctorsCount,
    fetchTopDoctors,
} from "@/lib/data-access/doctors/data";
import {
    fetchOutwardReferralsOverview,
    fetchInwardReferralsOverview,
} from "@/lib/data-access/referrals/data";
import { Role } from "@/lib/definitions";

interface StaffDashboardProps {
    session: {
        user: {
            userId: string;
            username: string;
            role: Role;
            hospitalId: number | null;
        };
    };
}

const StaffDashboard: React.FC<StaffDashboardProps> = async ({ session }) => {
    const firstName = useMemo(
        () => session?.user?.username?.split(" ")[0] || "Staff",
        [session.user.username]
    );

    const params = useMemo(
        () => ({
            role: session.user.role,
            hospitalId: session.user.hospitalId,
            userId: null,
        }),
        [session.user.role, session.user.hospitalId]
    );

    try {
        const [
            appointmentsResponse,
            appointmentsOverview,
            patientsOverview,
            availableBedsCount,
            onlineDoctorsCount,
            inwardReferralsOverview,
            outwardReferralsOverview,
            topDoctors,
        ] = await Promise.all([
            fetchAppointments(params),
            fetchAppointmentsOverview(),
            fetchPatientsOverview(),
            fetchAvailableBedsCount(params),
            fetchOnlineDoctorsCount(params),
            fetchInwardReferralsOverview(),
            fetchOutwardReferralsOverview(),
            fetchTopDoctors(params),
        ]);

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
                            <TopDoctorsCard topDoctors={topDoctors || []} />
                        </div>
                        <div>
                            <LearnMoreCard />
                        </div>
                    </div>
                </div>
            </>
        );
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        return (
            <div className="text-destructive text-center">
                Failed to load dashboard data. Please try again later.
            </div>
        );
    }
};

export default StaffDashboard;
