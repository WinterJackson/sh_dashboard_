// src/app/(auth)/dashboard/doctors/add-new-doctor/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AddDoctorForm from "@/components/doctors/ui/add-new-doctor/AddDoctorForm";
import { fetchSpecializations } from "@/lib/data-access/specializations/data";
import { fetchDepartments } from "@/lib/data-access/departments/data";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { Role } from "@/lib/definitions";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";


export default async function AddNewDoctorPage() {
    const session = await getServerSession(authOptions);

    // Redirect unauthorized users
    if (!session || (session?.user?.role !== Role.SUPER_ADMIN && session.user?.role !== Role.ADMIN)) {
        redirect("/dashboard");
        return null;
    }

    const user = {
        role: session?.user?.role as Role,
        hospitalId: session?.user?.hospitalId ? parseInt(session.user.hospitalId.toString(), 10) : null,
        userId: session?.user?.id || null,
    };

    // Handle promises individually
    const [specializations, departments, hospitals] = await Promise.all([
        fetchSpecializations(user).catch((error) => {
            console.error("Error fetching specializations:", error);
            return [];
        }),

        fetchDepartments(
            session?.user
                ?   {
                        role: session.user.role as Role,
                        hospitalId: session.user.hospitalId ? session.user.hospitalId.toString() : null,
                    }
                : undefined
        ).catch((error) => {
            console.error("Error fetching departments:", error);
            return [];
        }),
        
        fetchHospitals(user).catch((error) => {
            console.error("Error fetching hospitals:", error);
            return [];
        }),
    ]);

    return (
        <div className="flex flex-col gap-3 p-3 pt-0">
            <div className="flex items-center gap-2 bg-slate p-2 rounded-[10px] w-full">
                <h1 className="text-xl font-bold">Add New Doctor</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={16} className="text-text-muted" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Fill out the form below to register a new doctor.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <AddDoctorForm
                specialties={specializations}
                departments={departments}
                hospitals={hospitals}
                userRole={user.role as Role}
                userHospitalId={user.hospitalId?.toString() || null}
                sessionUser={user}
            />
        </div>
    );
}
