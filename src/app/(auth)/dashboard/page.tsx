// src/app/(auth)/dashboard/page.tsx file

import AdminDashboard from "@/components/dashboard/admin-dashboard/AdminDashboard";
// import NormalDashboard from "@/components/dashboard/normal-dashboard/NormalDashboard";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard/SuperAdminDashboard";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
                // <NormalDashboard />
            )}
        </div>
    );
}
