// src/app/(auth)/dashboard/layout.tsx

import HeaderWrapper from "@/components/header/HeaderWrapper";
import RedirectBoundary from "@/components/providers/RedirectBoundary";
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import { OnboardingToast } from "@/components/OnboardingToast";
import { WelcomeToast } from "@/components/WelcomeToast";
import React from "react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RedirectBoundary>
            <div className="flex relative w-full flex-col min-h-screen bg-gray-100 overflow-hidden">
                <HeaderWrapper />
                <OnboardingToast />
                <WelcomeToast />
                <div className="flex flex-grow pt-20 min-h-screen">
                    <aside className="fixed ml-2 top-[80px] left-0 w-64 h-[1010px] mt-10">
                        <SidebarWrapper />
                    </aside>
                    <main className="ml-64 w-full h-[100vh] overflow-y-auto p-4 mt-10 bg-gray-100 scrollbar-custom">
                        {children}
                    </main>
                </div>
            </div>
        </RedirectBoundary>
    );
}
