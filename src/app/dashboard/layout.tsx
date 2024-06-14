// src/app/dashboard/layout.tsx file

import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-row h-full">
                <Sidebar />
                <main className="flex-grow p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}