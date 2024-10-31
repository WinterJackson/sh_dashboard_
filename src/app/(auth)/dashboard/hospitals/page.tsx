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
    const session = await getServerSession(authOptions);

    // Check for session and user role with optional chaining
    if (!session || session?.user?.role !== Role.SUPER_ADMIN) {
        redirect("/unauthorized");
        return null;
    }

    const page = parseInt(searchParams.page || "1");
    const [hospitals, totalHospitals] = await prisma.$transaction([
        prisma.hospital.findMany({
            skip: (page - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
        }),
        prisma.hospital.count(),
    ]);

    return (
        <div className="flex flex-col h-full min-w-full p-4">
            <h1 className="text-xl min-w-full font-semibold mb-1">Hospitals</h1>
            <HospitalsTable hospitals={hospitals} totalHospitals={totalHospitals} currentPage={page} />
            <HospitalsPagination totalItems={totalHospitals} itemsPerPage={ITEMS_PER_PAGE} currentPage={page} />
        </div>
    );
}


