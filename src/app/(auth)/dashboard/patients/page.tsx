// src/app/(auth)/dashboard/patients/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import PatientsList from "@/components/patients/PatientsList";
import { fetchPatients } from "@/lib/data-access/patients/data";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { Role } from "@/lib/definitions";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default async function PatientsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const userId = session?.user?.id;
    const role = session?.user?.role as Role;
    const hospitalId = session?.user?.hospitalId;

    // Fetch patients and total count
    const { patients, totalPatients } = await fetchPatients({
        role,
        hospitalId: hospitalId ?? null,
        userId,
    });

    // Fetch all hospitals if the user is a SUPER_ADMIN
    const hospitals =
        role === "SUPER_ADMIN"
            ? await fetchHospitals({
                  role,
                  hospitalId: hospitalId ?? null,
                  userId,
              })
            : [];

    return (
        <div className="flex flex-col gap-3 p-3 pt-0 w-full">
            <div className="flex w-full justify-between gap-2 bg-bluelight/5 p-2 rounded-[10px]">
                <h1 className="text-xl font-bold">Patients</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={16} className="text-gray-600" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Click on a patient row to view patient details</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <PatientsList
                patients={patients}
                totalPatients={totalPatients}
                hospitals={hospitals}
                userRole={role}
                hospitalId={hospitalId}
            />
        </div>
    );
}
