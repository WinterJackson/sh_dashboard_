// src/app/(auth)/dashboard/doctors/add-new-doctor/page.tsx

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AddDoctorForm from "@/components/doctors/ui/add-new-doctor/AddDoctorForm";
import { fetchSpecializations } from "@/lib/data-access/specializations/data";
import { fetchDepartments } from "@/lib/data-access/departments/data";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { fetchServices, filteredServices } from "@/lib/data-access/services/data";
import { Role } from "@/lib/definitions";


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
    const [specializations, departments, hospitals, services] = await Promise.all([
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

        fetchServices(user).catch((error) => {
            console.error("Error fetching services:", error);
            return [];
        }),
    ]);

    return (
        <div className="p-6 px-2 pt-0">
            <h1 className="mx-2 mb-5 text-xl font-bold bg-bluelight/5 p-2 pl-4 rounded-[10px]">
                Add New Doctor
            </h1>
                <p className="text-gray-600 my-4 px-2 ml-4">
                    Fill out the form below to register a new doctor
                </p>
            <AddDoctorForm
                specialties={specializations}
                departments={departments}
                hospitals={hospitals}
                services={services}
                filteredServices={filteredServices}
                userRole={user.role as Role}
                userHospitalId={user.hospitalId?.toString() || null}
                sessionUser={user}
            />
        </div>
    );
}
