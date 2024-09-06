// src/app/(auth)/dashboard/layout.tsx

"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname()

    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <div className="flex w-full flex-col h-[calc(100vh-160px)] bg-gray-100 ">
    {/* settings navbar */}
            <div className="flex gap-14 items-center px-7 border-b-2 " >
                <Link href={"/dashboard/settings"}>
                    <div className={`flex items-center justify-center py-6${
                         isActive("/dashboard/settings")
                         ? " text-primary border-b-4 border-primary"
                         : "hover:bg-bluelight hover:text-black"
                    }`}>
                        <p className="font-bold">Account</p>
                    </div>
                </Link>

                <Link href={"/dashboard/settings/notification"}>
                    <div className={`flex items-center justify-center py-6${
                         isActive("/dashboard/settings/notification")
                         ? " text-primary border-b-4 border-primary"
                         : "hover:bg-bluelight hover:text-black"
                    }`}>
                        <p className="font-bold">Notification</p>
                    </div>
                </Link>

                <Link href={"/dashboard/settings/security"}>
                    <div className={`flex items-center justify-center py-6${
                         isActive("/dashboard/settings/security")
                         ? " text-primary border-b-4 border-primary"
                         : "hover:bg-bluelight hover:text-black"
                    }`}>
                        <p className="font-bold">Security</p>
                    </div>
                </Link>
                
                <Link href={"/dashboard/settings/support"}>
                    <div className={`flex items-center justify-center py-6${
                         isActive("/dashboard/settings/support")
                         ? " text-primary border-b-4 border-primary"
                         : "hover:bg-bluelight hover:text-black"
                    }`}>
                        <p className="font-bold">Support</p>
                    </div>
                </Link>
                
            </div>
            <main className="w-full h-full overflow-y-scroll px-7 py-3 bg-gray-100">
                {children}
            </main>
        </div>
    );
}