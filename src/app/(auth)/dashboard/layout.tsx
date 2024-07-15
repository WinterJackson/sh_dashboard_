// src/app/(auth)/dashboard/layout.tsx file

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebars/Sidebar";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex relative w-full flex-col min-h-screen">
            <Header />
            <div className="flex relative w-full flex-row h-full">
                <Sidebar />
                <main className="w-3/4 flex-grow p-4">{children}</main>
            </div>
        </div>
    );
}
