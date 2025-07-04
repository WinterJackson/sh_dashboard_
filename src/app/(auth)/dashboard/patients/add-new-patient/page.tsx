// src/app/(auth)/dashboard/patients/add-new-patient/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AddPatientForm from "@/components/patients/ui/add-new-patient/AddPatientForm";
import { Role } from "@/lib/definitions";

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
        <div className="max-w-full mx-auto p-4 pt-0">
            <div className="mb-8">
                <h1 className="mb-5 text-xl font-bold bg-bluelight/5 p-2 pl-4 rounded-[10px]">
                    Add New Patient
                </h1>
                <p className="text-gray-600 my-4 px-2 ml-2">
                    Fill out the form below to register a new patient
                </p>

                <AddPatientForm
                    hospitalId={initialHospitalId}
                    userRole={userRole}
                />
            </div>
        </div>
    );
}
