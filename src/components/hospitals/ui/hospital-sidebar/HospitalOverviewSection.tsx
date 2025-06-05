// src/components/hospitals/ui/hospital-profile/HospitalOverviewSection.tsx
"use client";

import { Hospital } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Role } from "@/lib/definitions";

export default function HospitalOverviewSection({
    hospital,
}: {
    hospital: Hospital;
}) {
    const router = useRouter();
    const { data: session } = useSession();
    const userRole = session?.user?.role as Role;

    const handleViewDoctors = () => {
        router.push(`/dashboard/hospitals/${hospital.hospitalId}/doctors`);
    };

    const handleViewAdmins = () => {
        router.push(`/dashboard/hospitals/${hospital.hospitalId}/admins`);
    };

    return (
        <Card className="bg-white shadow-md rounded-[10px]">
            <CardHeader className="flex flex-row justify-between items-center bg-bluelight rounded-t-[10px] mb-8">
                <CardTitle className="text-lg whitespace-nowrap mr-2 font-semibold">
                    {hospital.hospitalName} - Overview
                </CardTitle>
                <div className="flex gap-2">
                    {userRole === Role.SUPER_ADMIN && (
                        <Button
                            className="bg-primary text-white rounded-[10px] whitespace-nowrap"
                            onClick={handleViewAdmins}
                        >
                            View Admins
                        </Button>
                    )}
                    <Button
                        className="bg-primary text-white rounded-[10px] whitespace-nowrap"
                        onClick={handleViewDoctors}
                    >
                        View Doctors
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-black/5 p-4 rounded-[10px]">
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Hospital ID:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.hospitalId}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Ownership Type:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.ownershipType || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">KEPH Level:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.kephLevel || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Category:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.category || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Owner:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.owner || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">County:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.county || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Sub-county:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.subCounty || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Ward:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.ward || "N/A"}</span>
                    </p>
                </div>
                <div className="space-y-2 bg-black/5 p-4 rounded-[10px]">
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Town:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.town || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Address:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.streetAddress || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Phone:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.phone || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Email:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.email || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Emergency Phone:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.emergencyPhone || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Emergency Email:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.emergencyEmail || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Referral Code:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.referralCode || "N/A"}</span>
                    </p>
                    <p className="flex gap-2 justify-between whitespace-nowrap bg-white p-2 rounded-[5px]">
                        <span className="font-semibold">Nearest Landmark:</span>
                        <span className="truncate overflow-hidden whitespace-nowrap" >{hospital.nearestLandmark || "N/A"}</span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
