// src/components/dashboard/nurse-dashboard/NurseDashboard.tsx

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

interface NurseDashboardProps {
    session: {
        user: {
            userId: string;
            username: string;
            role: Role;
            hospitalId: number | null;
        };
    };
}

const NurseDashboard: React.FC<NurseDashboardProps> = async ({ session }) => {
    const firstName = session?.user?.username?.split(" ")[0] || "Super Admin";

    const { appointments, totalAppointments } = await fetchAppointments(
        session?.user
            ? {
                  role: session.user.role as Role,
                  hospitalId: session.user.hospitalId,
                  userId: null,
              }
            : undefined
    );

    // Fetch available beds count
    const availableBedsCount = await fetchAvailableBedsCount(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                }
            : undefined
    );

    // Fetch available doctors count
    const onlineDoctorsCount = await fetchOnlineDoctorsCount(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                }
            : undefined
    );

    // Fetch inward referrals
    const inwardReferrals = await fetchInwardReferrals(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                }
            : undefined
    );

    // Fetch outward referrals
    const outwardReferrals = await fetchOutwardReferrals(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                }
            : undefined
    );

    // Fetch today's appointments count
    const appointmentsTodayCount = await fetchAppointmentsTodayCount(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                    userId: null,
                }
            : undefined
    );

    // Fetch appointments for last 14 days
    const last14DaysAppointments = await fetchAppointmentsForLast14Days(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                    userId: null,
                }
            : undefined
    );

    // Fetch unique patients today
    const uniquePatientsTodayCount = await fetchPatientsTodayCount(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                    userId: null,
                }
            : undefined
    );

    // Fetch unique patients for last 14 days
    const { currentWeekPatients, previousWeekPatients } = await fetchPatientsForLast14Days(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                    userId: null,
                }
            : undefined
    );

    // Fetch top doctors based on role and hospital ID
    const topDoctors = await fetchTopDoctors(
        session?.user
            ?   {
                    role: session.user.role as Role,
                    hospitalId: session.user.hospitalId,
                }
            : undefined
    );

    // Transform appointments to match the required type
    const transformedAppointments = appointments.map(
        (appointment: {
            appointmentDate: string | number | Date;
            hospitalId: any;
            patientId: any;
        }) => ({
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
                            uniquePatientsTodayCount={uniquePatientsTodayCount}
                            currentWeekPatients={currentWeekPatients}
                            previousWeekPatients={previousWeekPatients}
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
                        appointments={appointments}
                        totalAppointments={totalAppointments}
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
};

export default NurseDashboard;
