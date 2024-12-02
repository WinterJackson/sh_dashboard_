// src/app/(auth)/dashboard/hospitals/page.tsx

import React from "react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Role } from "@/lib/definitions";
import HospitalsPagination from "@/components/hospitals/HospitalsPagination";

const prisma = require("@/lib/prisma");

const HospitalsTable = dynamic(() => import("@/components/hospitals/HospitalsTable"), { ssr: false });

const ITEMS_PER_PAGE = 5;

interface SearchParams {
    page?: string;
}

interface HospitalsPageProps {
    searchParams: SearchParams;
}

export default async function HospitalsPage({ searchParams }: HospitalsPageProps) {
    // Fetch session
    const session = await getServerSession(authOptions);

    // Redirect if session is invalid or user role isn't SUPER_ADMIN
    if (!session || session.user?.role !== Role.SUPER_ADMIN) {
        redirect("/sign-in");
        return null;
    }

    const page = parseInt(searchParams.page || "1");

    // Fetch hospitals and total hospital count
    const [hospitals, totalHospitals] = await prisma.$transaction([
        prisma.hospital.findMany({
            skip: (page - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
        }),
        prisma.hospital.count(),
    ]);

    return (
        <div className="flex flex-col h-full min-w-full p-4">
            <h1 className="text-xl font-bold bg-bluelight/5 p-2 rounded-[10px]">
                Hospitals
            </h1>
            <HospitalsTable 
                hospitals={hospitals} 
                totalHospitals={totalHospitals} 
                currentPage={page} 
            />
            <HospitalsPagination 
                totalItems={totalHospitals} 
                itemsPerPage={ITEMS_PER_PAGE} 
                currentPage={page} 
            />
        </div>
    );
}


