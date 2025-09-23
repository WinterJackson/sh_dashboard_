// src/app/(auth)/dashboard/patients/add-new-patient/page.tsx

export const dynamic = 'force-dynamic';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AddPatientForm from "@/components/patients/ui/add-new-patient/AddPatientForm";
import { Role } from "@/lib/definitions";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default async function AddNewPatientPage() {
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users
    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    const { id: userId, hospitalId, role } = session.user;

    const userRole = role as Role;

    const initialHospitalId = userRole === Role.SUPER_ADMIN ? null : hospitalId;

    return (
        <div className="flex flex-col gap-3 p-3 pt-0">
            <div className="flex items-center gap-2 bg-slate p-2 rounded-[10px] w-full">
                <h1 className="text-xl font-bold">Add New Patient</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={16} className="text-text-muted" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Fill out the form below to register a new patient.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <AddPatientForm
                hospitalId={initialHospitalId}
                userRole={userRole}
            />
        </div>
    );
}
