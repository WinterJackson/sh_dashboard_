
// src/components/dashboard/DashboardDataContainer.tsx

import React from "react";
import { Role } from "@/lib/definitions";
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
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(() => import("./admin-dashboard/AdminDashboard"));
const DoctorDashboard = dynamic(() => import("./doc-dashboard/DoctorDashboard"));
const NurseDashboard = dynamic(() => import("./nurse-dashboard/NurseDashboard"));
const StaffDashboard = dynamic(() => import("./staff-dashboard/StaffDashboard"));
const SuperAdminDashboard = dynamic(() => import("./super-admin-dashboard/SuperAdminDashboard"));

interface DashboardDataContainerProps {
    session: {
        user: {
            userId: string;
            username: string;
            role: Role;
            hospitalId: number | null;
        };
    };
}

const DashboardDataContainer: React.FC<DashboardDataContainerProps> = async ({ session }) => {
    const params = {
        role: session.user.role,
        hospitalId: session.user.hospitalId,
        userId: session.user.userId,
    };

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

        const dashboardProps = {
            session,
            appointmentsResponse,
            appointmentsOverview,
            patientsOverview,
            availableBedsCount,
            onlineDoctorsCount,
            inwardReferralsOverview,
            outwardReferralsOverview,
            topDoctors: topDoctors || [],
        };

        switch (session.user.role) {
            case Role.SUPER_ADMIN:
                return <SuperAdminDashboard {...dashboardProps} />;
            case Role.ADMIN:
                return <AdminDashboard {...dashboardProps} />;
            case Role.DOCTOR:
                return <DoctorDashboard {...dashboardProps} />;
            case Role.NURSE:
                return <NurseDashboard {...dashboardProps} />;
            case Role.STAFF:
                return <StaffDashboard {...dashboardProps} />;
            default:
                return <div>Error: Unknown user role.</div>;
        }
    } catch (error) {
        console.error("Error loading dashboard data:", error);
        return (
            <div className="text-destructive text-center p-4">
                Failed to load dashboard data. Please try again later.
            </div>
        );
    }
};

export default DashboardDataContainer;
