// src/app/(auth)/dashboard/patients/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import PatientsList from "@/components/patients/PatientsList";
import { fetchPatients } from "@/lib/data-access/patients/data";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { Role } from "@/lib/definitions";

export default async function PatientsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session?.user) {
        redirect("/sign-in");
        return null;
    }

    const userId = session?.user?.id;
    const role = session?.user?.role as Role
    const hospitalId = session?.user?.hospitalId

    // Fetch patients and total count
    const { patients, totalPatients } = await fetchPatients({
        role,
        hospitalId,
        userId,
    });

    // Fetch all hospitals if the user is a SUPER_ADMIN
    const hospitals =
        role === "SUPER_ADMIN"
            ? await fetchHospitals()
            : [];

    return (
        <div className="flex flex-col gap-3 p-3 pt-0">
            <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">Patients</h1>
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