// src/app/(auth)/dashboard/doctors/page.tsx

import DoctorsList from "@/components/doctors/DoctorsList";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@/lib/definitions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { fetchDoctors } from "@/lib/data-access/doctors/data";
import { fetchDepartments } from "@/lib/data-access/departments/data";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default async function DoctorsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const user = {
        role: session.user.role as Role,
        hospitalId: session.user.hospitalId?.toString() || null,
        userId: session.user.id,
    };

    const doctors = await fetchDoctors(user);
    const hospitals = await fetchHospitals({
        role: session.user.role as Role,
        hospitalId: session.user.hospitalId ?? null,
        userId: session.user.id,
    });
    const departments = await fetchDepartments(
        session?.user
            ? {
                  role: session.user.role as Role,
                  hospitalId: session.user.hospitalId
                      ? session.user.hospitalId.toString()
                      : null,
              }
            : undefined
    );

    return (
        <div className="flex flex-col gap-3 p-3 pt-0 w-full">
            <div className="flex w-full gap-2 bg-bluelight/5 p-2 rounded-[10px]">
                <h1 className="text-xl font-bold">Doctors</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={16} className="text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click on a doctor card to view doctor details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <DoctorsList
                role={user.role}
                hospitalId={user.hospitalId}
                doctors={doctors}
                hospitals={hospitals}
                departments={departments}
            />
        </div>
    );
}
