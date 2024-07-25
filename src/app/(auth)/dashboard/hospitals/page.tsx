// src/app/dashboard/hospitals/page.tsx

import React from "react";
import dynamic from "next/dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Hospital } from "@/lib/definitions";

const prisma = require("@/lib/prisma");

const HospitalsTable = dynamic<{ hospitals: Hospital[], totalHospitals: number, currentPage: number }>(
    () => import("@/components/hospitals/HospitalsTable"),
    {
        ssr: false,
    }
);

const ITEMS_PER_PAGE = 5;

interface SearchParams {
    page?: string;
}

interface HospitalsPageProps {
    searchParams: SearchParams;
}

export default async function HospitalsPage({ searchParams }: HospitalsPageProps) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/sign-in");
        return null;
    }

    const page = parseInt(searchParams.page || '1');

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
            <div className="flex flex-row justify-between items-center mb-5">
                <HospitalsTable hospitals={hospitals} totalHospitals={totalHospitals} currentPage={page} />
            </div>
        </div>
    );
}
