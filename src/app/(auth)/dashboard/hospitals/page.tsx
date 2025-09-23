export const dynamic = 'force-dynamic';

// src/app/(auth)/dashboard/hospitals/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Role } from "@/lib/definitions";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import HospitalsList from "@/components/hospitals/HospitalsList";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default async function HospitalsPage() {
    const session = await getServerSession(authOptions);

    if (!session || session?.user?.role !== Role.SUPER_ADMIN) {
        redirect("/sign-in");
    }

    // Fetch hospitals data
    const hospitals = await fetchHospitals({
        role: session.user.role,
        hospitalId: session.user.hospitalId ?? null,
        userId: session.user.id,
    });

    return (
        <div className="cursor-pointer flex flex-col gap-3 p-3 pt-0">
            <div className="flex items-center gap-2 bg-slate p-2 rounded-[10px] w-full">
                <h1 className="text-xl font-bold">Hospitals</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={16} className="text-text-muted" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click on a hospital row to view hospital details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <HospitalsList
                hospitals={hospitals}
                totalHospitals={hospitals.length}
                userRole={session.user.role}
            />
        </div>
    );
}
