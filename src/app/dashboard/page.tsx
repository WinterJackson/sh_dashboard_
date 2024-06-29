// src/app/dashboard/page.tsx file

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getFirstName } from "@/lib/utils";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    const firstName = session?.user ? getFirstName(session.user.username) : "";

    if (!session) {
        redirect("/sign-in");
        return null;
    }

    return (
        <div className="h-full">
            <div className="text-xl font-semibold p-4 bg-white ml-0">
                Welcome, {firstName}
            </div>
        </div>
    );
}
