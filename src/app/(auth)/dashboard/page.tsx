// src/app/(auth)/dashboard/page.tsx

import React from "react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Session as CustomSession, Role } from "@/lib/definitions";
import { Session as NextAuthSession } from "next-auth";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard/SuperAdminDashboard";
import AdminDashboard from "@/components/dashboard/admin-dashboard/AdminDashboard";
import DoctorDashboard from "@/components/dashboard/doc-dashboard/DoctorDashboard";
import NurseDashboard from "@/components/dashboard/nurse-dashboard/NurseDashboard";
import StaffDashboard from "@/components/dashboard/staff-dashboard/StaffDashboard";


export default async function DashboardPage() {
    const nextAuthSession: NextAuthSession | null = await getSession();

    if (!nextAuthSession || !nextAuthSession.user) {
        redirect("/sign-in");
        return null;
    }

    const customSession: CustomSession = {
        sessionId: nextAuthSession.user.id,
        userId: nextAuthSession.user.id,
        expires: nextAuthSession.expires
            ? new Date(nextAuthSession.expires)
            : new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
            id: nextAuthSession.user.id,
            username: nextAuthSession.user.username ?? "",
            role: (nextAuthSession.user.role as Role) ?? "STAFF",
            hospitalId: nextAuthSession.user.hospitalId ?? null,
            hospital: null,
        },
    };

    const { user } = customSession;

    if (!user.username || !user.role || user.hospitalId === undefined) {
        return <p>Invalid session data. Please contact support.</p>;
    }

    return (
        <div className="h-full">
            {user.role === "SUPER_ADMIN" ? (
                <SuperAdminDashboard session={customSession} />
            ) : user.role === "ADMIN" ? (
                <AdminDashboard session={customSession} />
            ) : user.role === "DOCTOR" ? (
                <DoctorDashboard session={customSession} />
            ) : user.role === "NURSE" ? (
                <NurseDashboard session={customSession} />
            ) : user.role === "STAFF" ? (
                <StaffDashboard session={customSession} />
            ) : (
                <p>You are not authorized to access this dashboard.</p>
            )}
        </div>
    );
}