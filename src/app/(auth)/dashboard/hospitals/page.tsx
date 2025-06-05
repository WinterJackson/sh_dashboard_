// src/app/(auth)/dashboard/hospitals/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Role } from "@/lib/definitions";
import { fetchHospitals } from "@/lib/data-access/hospitals/data";
import HospitalsList from "@/components/hospitals/HospitalsList";

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
        <div className="flex flex-col gap-3 p-3 pt-0">
            <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">
                Hospitals
            </h1>
            <HospitalsList
                hospitals={hospitals}
                totalHospitals={hospitals.length}
                userRole={session.user.role}
            />
        </div>
    );
}
