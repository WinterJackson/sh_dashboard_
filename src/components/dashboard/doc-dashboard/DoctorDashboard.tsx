// src/components/dashboard/doc-dashboard/DoctorDashboard.tsx

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
// import { fetchAppointments } from "@/lib/data";

interface DoctorDashboardProps {
    session: {
        user: {
            username: string;
            role: string;
            hospitalId: number | null;
        };
    };
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = async ({ session }) => {
    const firstName = session.user.username.split(" ")[0] || "Super Admin";

    // Fetch appointments using Prisma with role and hospitalId filtering
    const whereClause = 
        session.user.role === "SUPER_ADMIN" 
            ? {} // SUPER_ADMIN sees all appointments
            : { hospitalId: session.user.hospitalId };

    const totalAppointments = await prisma.appointment.count({ where: whereClause });
    const appointments = await prisma.appointment.findMany({
        where: whereClause,
        include: {
            patient: { select: { name: true, patientId: true, dateOfBirth: true } },
            doctor: {
                select: { user: { select: { profile: { select: { firstName: true, lastName: true } } } } },
            },
            hospital: { select: { name: true, hospitalId: true } },
        },

    });

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
                        <AvailableDoctorsCard session={session} />
                        <AvailableBedsCard session={session} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        <AppointmentsTodayCard session={session} />
                        <PatientsTodayCard session={session} />
                    </div>
                </div>
                <div className="grid w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        <OutwardReferralsCard session={session} />
                        <InwardReferralsCard session={session} />
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="grid w-full p-4">
                    <PatientsGraphCard
                        session={session}
                        appointments={transformedAppointments}
                    />
                </div>
                <div className="grid w-full p-4">
                    <PatientsGraphCard
                        session={session}
                        appointments={transformedAppointments}
                    />
                </div>
            </div>
            <div className="flex w-full">
                <div className="w-2/3 p-4">

                    {/* Fetch appointments using API route with pagination */}
                    {/* Uncomment below to use API-based fetching instead */}
                    {/* 
                    const { appointments, totalAppointments, page, pageSize } = await fetchAppointments(
                        session.user.role,
                        session.user.hospitalId
                    );

                    <DashboardAppointments
                        session={session}
                        appointments={appointments}
                        totalAppointments={totalAppointments}
                        page={page}
                        pageSize={pageSize}
                    /> 
                    */}

                    {/* Fetched using Prisma */}
                    <DashboardAppointments
                        session={session}
                        appointments={appointments}
                        totalAppointments={totalAppointments}
                    />
                </div>
                <div className="w-1/3 p-2 h-full">
                    <div className="h-1/2">
                        <TopDoctorsCard session={session} />
                    </div>
                    <div className="h-1/2">
                        <LearnMoreCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorDashboard;

