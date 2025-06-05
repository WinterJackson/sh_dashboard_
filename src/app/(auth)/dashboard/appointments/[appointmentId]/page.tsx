// src/app/(auth)/dashboard/appointments/[appointmentId]/page.tsx

import { notFound, redirect } from "next/navigation";
import AppointmentDetails from "@/components/appointments/ui/appointment-page/AppointmentDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function AppointmentPage({
    params,
}: {
    params: { appointmentId: string };
}) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect("/sign-in");
        return null;
    }

    const { appointmentId } = params;
    if (!appointmentId) return notFound();

    return <AppointmentDetails appointmentId={appointmentId} />;
}
