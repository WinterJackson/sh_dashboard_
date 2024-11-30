// src/app/(auth)/dashboard/layout.tsx

import HeaderWrapper from "@/components/header/ui/HeaderWrapper";
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";
import { getSession, getUserProfile } from "@/lib/session";
import React from "react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch session data and user profile
    const session = await getSession();
    const profileData = session?.user
        ? await getUserProfile(session.user.id)
        : null;

    return (
        <div className="flex relative w-full flex-col min-h-screen bg-gray-100 overflow-hidden">
            <HeaderWrapper profileData={profileData} />

            <div className="flex flex-grow pt-20 min-h-screen">
                <aside className="fixed mt-0 ml-2 top-[120px] left-0 w-64 h-[1010px] bg-gray-100 z-5 shadow-lg">
                    <SidebarWrapper
                        session={session}
                        profileData={profileData}
                    />
                </aside>

                <main className="ml-64 w-full h-[calc(100vh-100px)] overflow-y-auto p-4 pt-11 bg-gray-100 scrollbar-custom">
                    {children}
                </main>
            </div>
        </div>
    );
}
