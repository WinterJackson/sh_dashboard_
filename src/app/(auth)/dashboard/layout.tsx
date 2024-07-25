// src/app/(auth)/dashboard/layout.tsx

"use client"

import Header from "@/components/header/Header";
import SuperAdminSidebar from "@/components/sidebars/SuperAdminSidebar";
import AdminSidebar from "@/components/sidebars/AdminSidebar";
import DoctorSidebar from "@/components/sidebars/DoctorSidebar";
import NurseSidebar from "@/components/sidebars/NurseSidebar";
import StaffSidebar from "@/components/sidebars/StaffSidebar";
import { useUserRole } from "@/hooks/useUserRole";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const role = useUserRole();

    return (
        <div className="flex relative w-full flex-col min-h-screen">
            <Header />
            <div className="flex relative w-full flex-row h-full">
                <div className="w-auto">
                    {role === "SUPER_ADMIN" ? (
                        <SuperAdminSidebar />
                    ) : role === "ADMIN" ? (
                        <AdminSidebar />
                    ) : role === "DOCTOR" ? (
                        <DoctorSidebar />
                    ) : role === "NURSE" ? (
                        <NurseSidebar />
                    ) : role === "STAFF" ? (
                        <StaffSidebar />
                    ) : null
                    }
                </div>
                <main className="w-3/4 flex-grow">{children}</main>
            </div>
        </div>
    );
}
