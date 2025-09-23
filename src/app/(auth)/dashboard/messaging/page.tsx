// src/app/(auth)/dashboard/messaging/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { fetchConversations } from "@/lib/data-access/conversations/data";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { Role } from "@/lib/definitions";
import MessagingClient from "../../../../components/messaging/MessagingClient";

export const dynamic = 'force-dynamic';

export default async function MessagingPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/sign-in");
        return null;
    }

    const { id: userId, role, hospitalId } = session.user;

    // Fetch initial data on the server
    const { conversations, totalConversations } = await fetchConversations(userId, role as Role, hospitalId ?? undefined);
    const hospitals = role === Role.SUPER_ADMIN ? await fetchHospitals({ role: role as Role, hospitalId: null, userId: null }) : [];

    return (
        <MessagingClient
            initialConversations={conversations}
            totalConversations={totalConversations}
            initialHospitals={hospitals}
        />
    );
}