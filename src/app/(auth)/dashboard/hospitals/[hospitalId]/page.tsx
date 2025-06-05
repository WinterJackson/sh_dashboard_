// src/app/(auth)/dashboard/hospitals/[hospitalId]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect, notFound } from "next/navigation";
import { fetchHospitalDetailsById } from "@/lib/data-access/hospitals/data";
import HospitalSidebar from "@/components/hospitals/ui/hospital-sidebar/HospitalSidebar";
import HospitalOverviewSection from "@/components/hospitals/ui/hospital-sidebar/HospitalOverviewSection";
import DepartmentsSection from "@/components/hospitals/ui/hospital-profile/DepartmentsSection";
import BedCapacitySection from "@/components/hospitals/ui/hospital-profile/BedCapacitySection";
import HospitalLocationSection from "@/components/hospitals/ui/hospital-profile/HospitalLocationSection";
import Link from "next/link";
import { Role } from "@/lib/definitions";

interface HospitalProfilePageProps {
    params: {
        hospitalId: string;
    };
}

export default async function HospitalProfilePage({
    params,
}: HospitalProfilePageProps) {
    const session = await getServerSession(authOptions);

    const { user } = session || {};
    const { role, id: userId } = user || {};

    if (!session) {
        redirect("/sign-in");
    }

    // Validate hospitalId
    const hospitalId = Number(params.hospitalId);

    if (isNaN(hospitalId)) {
        notFound();
    }

    // Fetch hospital details
    const hospital = await fetchHospitalDetailsById(hospitalId);

    if (!hospital) {
        notFound();
    }

    return (
        <div className="flex flex-col gap-1">
            {/* breadcrumb */}
            <nav className="breadcrumbs text-sm px-4">
                <ul className="flex gap-2">
                    <li>
                        <Link
                            href="/dashboard/hospitals"
                            className="text-primary hover:text-blue-700"
                        >
                            Hospitals
                        </Link>
                    </li>
                    <span>|</span>
                    <li>
                        <Link
                            href={`/dashboard/hospitals/${hospitalId}`}
                            className="font-semibold text-gray-600 hover:text-primary"
                        >
                            {hospital.hospitalName || "Unnamed Hospital"}
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="flex flex-col md:flex-row gap-6 p-4">
                {/* sidebar */}
                <div className="w-auto md:w-auto">
                    <HospitalSidebar hospital={hospital} />
                </div>

                {/* main content */}
                <div className="w-full md:w-full space-y-8">
                    <HospitalOverviewSection hospital={hospital} />

                    <div className="flex flex-row gap-4">
                        {/* Bed Capacity Section*/}
                        <div className="w-1/2 h-auto">
                            <BedCapacitySection hospital={hospital} />
                        </div>

                        {/* Map Section */}
                        <div className="w-1/2 h-auto">
                            <HospitalLocationSection
                                hospitalId={hospitalId}
                                latitude={hospital.latitude}
                                longitude={hospital.longitude}
                                hospitalName={hospital.hospitalName}
                                userRole={role as Role}
                                userId={userId}                            />
                        </div>
                    </div>

                    <DepartmentsSection hospital={hospital} />
                </div>
            </div>
        </div>
    );
}
