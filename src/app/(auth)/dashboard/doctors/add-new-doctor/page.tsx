// src/pages/dashboard/doctors/add-new-doctor/page.tsx

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AddDoctorForm from "@/components/doctors/ui/add-new-doctor/AddDoctorForm";
import { fetchSpecializations, fetchDepartments, fetchHospitals, fetchServices } from "@/components/doctors/ui/add-new-doctor/doctorAPI";
import { Role } from "@/lib/definitions";

export default async function AddNewDoctorPage() {
    const session = await getSession();

    // Redirect unauthorized users
    if (!session || (session.user.role !== Role.SUPER_ADMIN && session.user.role !== Role.ADMIN)) {
        redirect("/dashboard");
        return null;
    }

    const [specializations, departments, hospitals, services] = await Promise.all([
        fetchSpecializations(),
        fetchDepartments(),
        fetchHospitals(),
        fetchServices(session.user.role, session.user.hospitalId || null),
    ]);

    return (
        <div className="p-6 px-2 pt-4">
            <h1 className="mx-2 mb-4 text-xl font-bold bg-bluelight/5 p-2 pl-4 rounded-[10px]">
            Add New Doctor
            </h1>
            <AddDoctorForm
                specialties={specializations}
                departments={departments}
                hospitals={hospitals}
                services={services}
                userRole={session.user.role}
                userHospitalId={session.user.hospitalId || null}
            />
        </div>
    );
}
