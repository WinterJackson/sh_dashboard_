// src/app/(auth)/dashboard/page.tsx

import React from "react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard/SuperAdminDashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard/AdminDashboard";
import DoctorDashboard from "@/components/dashboard/doc-dashboard/DoctorDashboard";
import NurseDashboard from "@/components/dashboard/nurse-dashboard/NurseDashboard";
import StaffDashboard from "@/components/dashboard/staff-dashboard/StaffDashboard";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    const { user } = session;

    return (
        <div className="h-full">
            {user.role === "SUPER_ADMIN" ? (
                <SuperAdminDashboard session={session} />
            ) : user.role === "ADMIN" ? (
                <AdminDashboard session={session} />
            ) : user.role === "DOCTOR" ? (
                <DoctorDashboard session={session} />
            ) : user.role === "NURSE" ? (
                <NurseDashboard session={session} />
            ) : (
                <StaffDashboard session={session} />
            )}
        </div>
    );
}
