// src/app/dashboard/page.tsx file

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { getFirstName } from "@/lib/utils";
import AvailableDoctorsCard from "@/components/dashboard/AvailableDoctorsCard";
import AvailableBedsCard from "@/components/dashboard/AvailableBedsCard";

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <AvailableDoctorsCard />
                <AvailableBedsCard />
                {/* Add other cards here */}
            </div>
        </div>
    );
}
