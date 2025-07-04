// src/app/(auth)/dashboard/appointments/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AppointmentList from "@/components/appointments/AppointmentList";
import { fetchAppointments } from "@/lib/data-access/appointments/data";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { Role, Session, Hospital } from "@/lib/definitions";
import { redirect } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default async function AppointmentsPage() {
    const session: Session | null = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const role = session?.user?.role as Role;
    const hospitalId = session?.user?.hospitalId;
    const userId = session?.user?.id;

    const user = {
        role,
        hospitalId: hospitalId || null,
        userId,
    };

    const { appointments, totalAppointments } = await fetchAppointments(user);
    let hospitals: Hospital[] = [];
    if (role === Role.SUPER_ADMIN) {
        hospitals = await fetchHospitals({
            role,
            hospitalId: hospitalId ?? null,
            userId,
        });
    }

    return (
        <>
            <div className="flex items-center gap-2 bg-bluelight/5 rounded-[10px] p-2 mx-4 w-full">
                <h1 className="text-xl font-bold">Appointments</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={16} className="text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click on an appointment row to view appointment details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="p-4 pr-2 pt-4">
                <AppointmentList
                    appointments={appointments}
                    totalAppointments={totalAppointments}
                    session={session}
                    hospitals={hospitals}
                />
            </div>
        </>
    );
}
