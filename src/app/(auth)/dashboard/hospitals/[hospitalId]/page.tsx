// src/app/(auth)/dashboard/hospitals/[hospitalId]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Role } from "@/lib/definitions";

import HospitalSidebar from "@/components/hospitals/ui/hospital-sidebar/HospitalSidebar";
import HospitalOverviewSection from "@/components/hospitals/ui/hospital-sidebar/HospitalOverviewSection";
import BedCapacitySection from "@/components/hospitals/ui/hospital-profile/BedCapacitySection";
import HospitalLocationSection from "@/components/hospitals/ui/hospital-profile/HospitalLocationSection";
import DepartmentsSection from "@/components/hospitals/ui/hospital-profile/DepartmentsSection";

import {
    fetchHospitalBasicInfo,
    fetchBedCapacity,
    fetchHospitalDepartments,
} from "@/lib/data-access/hospitals/data";

interface HospitalProfilePageProps {
    params: {
        hospitalId: string;
    };
}

export default async function HospitalProfilePage({
    params,
}: HospitalProfilePageProps) {
    // ensure user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/sign-in");
    }

    // extract role and userId for authorization and child components
    const { user } = session || {};
    const { role, id: userId } = user || {};

    // validate hospitalId parameter
    const hospitalId = Number(params.hospitalId);
    if (isNaN(hospitalId)) {
        notFound();
    }

    try {
        // fetch basic info, bed capacity, and departments in parallel
        const [basicInfo, bedCapacityRows, departmentsRows] = await Promise.all(
            [
                fetchHospitalBasicInfo(hospitalId, {
                    role: role as Role,
                    hospitalId: userId ? hospitalId : null,
                    userId: userId || null,
                }),
                fetchBedCapacity(hospitalId, {
                    role: role as Role,
                    hospitalId: userId ? hospitalId : null,
                    userId: userId || null,
                }),
                fetchHospitalDepartments(hospitalId, {
                    role: role as Role,
                    hospitalId: userId ? hospitalId : null,
                    userId: userId || null,
                }),
            ]
        );

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
                                {basicInfo.hospitalName || "Unnamed Hospital"}
                            </Link>
                        </li>
                    </ul>
                </nav>

                <div className="flex flex-col md:flex-row gap-6 p-4">
                    {/* sidebar */}
                    <div className="w-auto md:w-auto">
                        <HospitalSidebar
                            hospital={basicInfo}
                            userRole={role as Role}
                        />
                    </div>

                    {/* main content */}
                    <div className="w-full md:w-full space-y-8">
                        <HospitalOverviewSection
                            hospital={basicInfo}
                            userRole={role as Role}
                        />

                        <div className="flex flex-row gap-4">
                            {/* bed capacity */}
                            <div className="w-1/2 h-auto">
                                <BedCapacitySection
                                    bedCapacity={bedCapacityRows}
                                    hospitalId={hospitalId}
                                    userRole={role as Role}
                                />
                            </div>

                            {/* map */}
                            <div className="w-1/2 h-auto">
                                <HospitalLocationSection
                                    hospitalId={hospitalId}
                                    latitude={basicInfo.latitude}
                                    longitude={basicInfo.longitude}
                                    hospitalName={basicInfo.hospitalName}
                                    userRole={role as Role}
                                />
                            </div>
                        </div>

                        <DepartmentsSection
                            departments={departmentsRows}
                            hospitalId={hospitalId}
                            userRole={role as Role}
                        />
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Failed to load hospital data:", error);
        notFound();
    }
}
