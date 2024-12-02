// src/app/(auth)/dashboard/page.tsx

import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard/SuperAdminDashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard/AdminDashboard";
import DoctorDashboard from "@/components/dashboard/doc-dashboard/DoctorDashboard";
import NurseDashboard from "@/components/dashboard/nurse-dashboard/NurseDashboard";
import StaffDashboard from "@/components/dashboard/staff-dashboard/StaffDashboard";

export default async function DashboardPage() {
    // Fetch session using NextAuth's getServerSession
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    const { user } = session;

    // Extract only the necessary data
    const filteredSession = {
        user: {
            username: user.username,
            role: user.role,
            hospitalId: user.hospitalId || null,
        },
    };

    return (
        <div className="h-full">
            {user.role === "SUPER_ADMIN" ? (
                <SuperAdminDashboard session={filteredSession} />
            ) : user.role === "ADMIN" ? (
                <AdminDashboard session={filteredSession} />
            ) : user.role === "DOCTOR" ? (
                <DoctorDashboard session={filteredSession} />
            ) : user.role === "NURSE" ? (
                <NurseDashboard session={filteredSession} />
            ) : (
                <StaffDashboard session={filteredSession} />
            )}
        </div>
    );
}
