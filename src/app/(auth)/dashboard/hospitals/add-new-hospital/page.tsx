
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AddHospitalForm from "@/components/hospitals/ui/add-new-hospital/AddHospitalForm";
import { Role } from "@/lib/definitions";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export default async function AddNewHospitalPage() {
    const session = await getServerSession(authOptions);

    // Redirect unauthorized users
    if (session?.user?.role !== Role.SUPER_ADMIN) {
        redirect("/dashboard");
        return null;
    }

    const user = {
        role: session?.user?.role as Role,
    };

    return (
        <div className="flex flex-col gap-3 p-3 pt-0">
            <div className="flex items-center gap-2 bg-slate p-2 rounded-[10px] w-full">
                <h1 className="text-xl font-bold">Add New Hospital</h1>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={16} className="text-text-muted" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Fill out the form below to register a new hospital.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <AddHospitalForm
                userRole={user.role as Role}
            />
        </div>
    );
}
