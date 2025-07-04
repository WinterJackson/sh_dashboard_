// src/app/(auth)/dashboard/page.tsx

import AdminDashboard from "@/components/dashboard/admin-dashboard/AdminDashboard";
import DoctorDashboard from "@/components/dashboard/doc-dashboard/DoctorDashboard";
import NurseDashboard from "@/components/dashboard/nurse-dashboard/NurseDashboard";
import StaffDashboard from "@/components/dashboard/staff-dashboard/StaffDashboard";
import SuperAdminDashboard from "@/components/dashboard/super-admin-dashboard/SuperAdminDashboard";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@/lib/definitions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const { user } = session;

    // Filter the session data for each role
    const filteredSession = {
        user: {
            userId: user?.id,
            username: user?.username,
            role: user?.role as Role,
            hospitalId: user?.hospitalId || null,
        },
    };

    return (
        <div className="h-full w-full">
            {user.role === "SUPER_ADMIN" ? (
                <SuperAdminDashboard session={filteredSession} />
            ) : user.role === "ADMIN" ? (
                <AdminDashboard session={filteredSession} />
            ) : user.role === "DOCTOR" ? (
                <DoctorDashboard session={filteredSession} />
            ) : user.role === "NURSE" ? (
                <NurseDashboard session={filteredSession} />
            ) : (
                <StaffDashboard session={filteredSession} />
            )}
        </div>
    );
}
