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
            <div className="flex relative w-full flex-col min-h-screen overflow-hidden">
                <HeaderWrapper />
                <div className="flex flex-grow pt-16 sm:pt-20 min-h-screen !gap-4">
                    {/* Sidebar hidden on small screens */}
                    <aside className="hidden md:block fixed top-[80px] left-4 w-64 h-[1010px] mt-10">
                        <SidebarWrapper />
                    </aside>

                    {/* Main content pushes right on md+, full width on mobile */}
                    <main className="w-full md:ml-[264px] h-[100vh] overflow-y-auto px-2 sm:px-4 sm:pr-0 md:px-6 md:pr-0 pt-2 pb-10 mt-8 custom-scrollbar-hide transition-all duration-500 ease-in-out">
                        {children}
                    </main>
                </div>
                <OnboardingToast />
                <WelcomeToast />
            </div>
        </RedirectBoundary>
    );
}
