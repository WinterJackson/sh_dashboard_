// File: src/components/dashboard/doc-dashboard/DoctorDashboard.tsx

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
import {
    fetchAppointments,
    fetchAppointmentsForLast14Days,
    fetchAppointmentsTodayCount,
} from "@/lib/data-access/appointments/data";
import { Role } from "@/lib/definitions";
import { fetchAvailableBedsCount } from "@/lib/data-access/beds/data";
import {
    fetchOnlineDoctorsCount,
    fetchTopDoctors,
} from "@/lib/data-access/doctors/data";
import {
    fetchInwardReferrals,
    fetchOutwardReferrals,
} from "@/lib/data-access/referrals/data";
import {
    fetchPatientsForLast14Days,
    fetchPatientsTodayCount,
} from "@/lib/data-access/patients/data";
import ServicesDataCard from "../ui/ServicesDataCard";

interface DoctorDashboardProps {
    session: {
        user: {
            userId: string;
            username: string;
            role: Role;
            hospitalId: number | null;
        };
    };
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = async ({ session }) => {
    const firstName = useMemo(
        () => session?.user?.username?.split(" ")[0] || "Doctor",
        [session.user.username]
    );

    // params object for all fetch calls
    const params = useMemo(
        () => ({
            role: session.user.role,
            hospitalId: null,
            userId: session.user.userId,
        }),
        [session.user.role, session.user.hospitalId]
    );

    try {
        // Fetch all data in parallel
        const [
            appointmentsResponse,
            availableBedsCount,
            onlineDoctorsCount,
            inwardReferrals,
            outwardReferrals,
            appointmentsTodayCount,
            last14DaysAppointments,
            uniquePatientsTodayCount,
            patientsLast14DaysResponse,
            topDoctors,
        ] = await Promise.all([
            fetchAppointments(params),
            fetchAvailableBedsCount({
                role: session.user.role,
                hospitalId: session.user.hospitalId,
            }),
            fetchOnlineDoctorsCount({
                role: session.user.role,
                hospitalId: session.user.hospitalId,
            }),
            fetchInwardReferrals({
                role: session.user.role,
                hospitalId: session.user.hospitalId,
            }),
            fetchOutwardReferrals({
                role: session.user.role,
                hospitalId: session.user.hospitalId,
            }),
            fetchAppointmentsTodayCount(params),
            fetchAppointmentsForLast14Days(params),
            fetchPatientsTodayCount(params),
            fetchPatientsForLast14Days(params),
            fetchTopDoctors({
                role: session.user.role,
                hospitalId: session.user.hospitalId,
            }),
        ]);

        // Transform appointments for graph card
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
                <div className="text-xl font-semibold p-4 mx-4 rounded-[10px] bg-bluelight/5">
                    Welcome, {firstName}
                </div>
                <div className="flex">
                    <div className="grid w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <AvailableDoctorsCard
                                session={session}
                                onlineDoctorsCount={onlineDoctorsCount}
                            />
                            <AvailableBedsCard
                                availableBedsCount={availableBedsCount}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <AppointmentsTodayCard
                                appointmentsTodayCount={appointmentsTodayCount}
                                last14DaysAppointments={
                                    last14DaysAppointments.appointments
                                }
                            />
                            <PatientsTodayCard
                                uniquePatientsTodayCount={
                                    uniquePatientsTodayCount
                                }
                                currentWeekPatients={
                                    patientsLast14DaysResponse.currentWeekPatients
                                }
                                previousWeekPatients={
                                    patientsLast14DaysResponse.previousWeekPatients
                                }
                            />
                        </div>
                    </div>
                    <div className="grid w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <OutwardReferralsCard
                                outwardReferrals={outwardReferrals}
                            />
                            <InwardReferralsCard
                                inwardReferrals={inwardReferrals}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="grid w-1/2 p-4">
                        <PatientsGraphCard
                            session={session}
                            appointments={transformedAppointments}
                        />
                    </div>
                    <div className="grid w-1/2 p-4">
                        <ServicesDataCard session={session} />
                    </div>
                </div>
                <div className="flex flex-row w-full h-full mt-4">
                    <div className="w-2/3 p-4 pr-2">
                        <DashboardAppointments
                            appointments={appointmentsResponse.appointments}
                            totalAppointments={
                                appointmentsResponse.totalAppointments
                            }
                        />
                    </div>
                    <div className="flex flex-col w-1/3 p-4 gap-4">
                        <div className="">
                            <TopDoctorsCard topDoctors={topDoctors || []} />
                        </div>
                        <div className="">
                            <LearnMoreCard />
                        </div>
                    </div>
                </div>
            </>
        );
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        return (
            <div className="text-red-500 text-center">
                Failed to load dashboard data. Please try again later.
            </div>
        );
    }
};

export default DoctorDashboard;
