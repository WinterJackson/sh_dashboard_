// src/app/(auth)/dashboard/page.tsx file

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getFirstName } from "@/lib/utils";
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import NormalDashboard from "@/components/dashboard/NormalDashboard";


export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
        return null;
    }

    const isSuperAdmin = session.user?.role === "SUPER_ADMIN";
    const isAdmin = session.user?.role === "ADMIN";

    return (
        <div className="h-full">
            {isSuperAdmin ? (
                <SuperAdminDashboard />
            ) : isAdmin ? (
                <AdminDashboard />
            ) : (
                <NormalDashboard />
            )}
        </div>
    );
}
