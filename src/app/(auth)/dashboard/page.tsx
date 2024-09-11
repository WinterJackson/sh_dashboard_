// src/app/(auth)/dashboard/page.tsx

import AdminDashboard from "@/components/dashboard/admin-dashboard/AdminDashboard";
import DoctorDashboard from "@/components/dashboard/doc-dashboard/DoctorDashboard";
import NurseDashboard from "@/components/dashboard/nurse-dashboard/NurseDashboard";
import StaffDashboard from "@/components/dashboard/staff-dashboard/StaffDashboard";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard/SuperAdminDashboard";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
        return null;
    }

    const isSuperAdmin = session.user?.role === "SUPER_ADMIN";
    const isAdmin = session.user?.role === "ADMIN";
    const isDoc = session.user?.role === "DOCTOR";
    const isNurse = session.user?.role === "NURSE";
    const isStaff = session.user?.role === "STAFF";

    return (
        <div className="h-full">
            {isSuperAdmin ? (
                <SuperAdminDashboard />
            ) : isAdmin ? (
                <AdminDashboard />
            ) : isDoc ? (
                <DoctorDashboard />
            ) : isNurse ? (
                <NurseDashboard />
            ) : isStaff ? (
                <StaffDashboard />
            ) : (
                <p>You are not authorized to access this dashboard.</p>
            )}
        </div>
    );
}
