// src/app/(auth)/dashboard/layout.tsx

"use client"

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebars/Sidebar";
import { useUserRole } from "@/hooks/useUserRole";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const role = useUserRole();

    return (
        <div className="flex relative w-full flex-col min-h-screen">
            {/* Fixed Header */}
            <Header />

            <div className="flex flex-row flex-grow pt-20 min-h-screen">
                {/* Fixed Sidebar */}
                <aside className="fixed top-20 left-0 w-64 h-[calc(100vh-4rem)] bg-white z-40 shadow-lg">
                    <Sidebar />
                </aside>

                {/* Scrollable Main Content */}
                <main className="ml-64 w-full h-screen overflow-y-auto p-4 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
