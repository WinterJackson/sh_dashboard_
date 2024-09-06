// src/app/(auth)/dashboard/layout.tsx

"use client";

import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex relative w-full flex-col min-h-screen bg-gray-100">
            {/* Fixed Header */}
            <Header />

            <div className="flex flex-grow pt-20 min-h-screen">
                {/* Fixed Sidebar */}
                <aside className="fixed mt-10 ml-2 top-20 left-0 w-64 h-5/6 bg-gray-100 z-5 shadow-lg">
                    <Sidebar />
                </aside>

                {/* Scrollable Main Content */}
                <main className="ml-64 w-full h-full lg:h-[calc(100vh-100px)] overflow-y-auto p-4 pt-11 bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
