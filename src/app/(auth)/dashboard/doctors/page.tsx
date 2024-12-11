// src/app/(auth)/dashboard/doctors/page.tsx

import DoctorsList from "@/components/doctors/DoctorsList";
import { authOptions } from "@/lib/authOptions";
import { Role } from "@/lib/definitions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import { fetchDoctors } from "@/lib/data-access/doctors/data";
import { fetchDepartments } from "@/lib/data-access/departments/data";

export default async function DoctorsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    const user = {
        role: session.user.role as Role,
        hospitalId: session.user.hospitalId?.toString() || null,
    };

    const doctors = await fetchDoctors(user);
    const hospitals = await fetchHospitals();
    const departments = await fetchDepartments(user);

    return (
        <div className="flex flex-col gap-3 p-3 pt-0">
            <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">
                Doctors
            </h1>
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
