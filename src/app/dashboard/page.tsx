// src/app/dashboard/page.tsx file

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
        return null;
    }

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            {/* Include your header, sidebar, and other components here */}
        </div>
    );
}
