// src/app/(auth)/dashboard/page.tsx

export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@/lib/definitions";
import DashboardDataContainer from "@/components/dashboard/DashboardDataContainer";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const { user } = session;

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
            <DashboardDataContainer session={filteredSession} />
        </div>
    );
}
