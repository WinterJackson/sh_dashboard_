// src/app/api-landing/page.tsx

import React from "react";
import Link from "next/link";
import {
    FaUserShield,
    FaCalendarCheck,
    FaUserLock,
    FaBed,
    FaBuilding,
    FaUserMd,
    FaHospital,
    FaEnvelope,
    FaUserNurse,
    FaUserInjured,
    FaCreditCard,
    FaUserCircle,
    FaShareSquare,
    FaKey,
    FaUserTag,
    FaBriefcaseMedical,
    FaClipboard,
    FaUpload,
    FaUsers,
} from "react-icons/fa";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

const routeIcons: Record<string, React.JSX.Element> = {
    administrators: <FaUserShield />,
    appointments: <FaCalendarCheck />,
    auth: <FaUserLock />,
    beds: <FaBed />,
    departments: <FaBuilding />,
    doctors: <FaUserMd />,
    hospitals: <FaHospital />,
    messages: <FaEnvelope />,
    nurses: <FaUserNurse />,
    patients: <FaUserInjured />,
    payments: <FaCreditCard />,
    profiles: <FaUserCircle />,
    referrals: <FaShareSquare />,
    "reset-password": <FaKey />,
    roles: <FaUserTag />,
    specializations: <FaBriefcaseMedical />,
    staff: <FaClipboard />,
    upload: <FaUpload />,
    users: <FaUsers />,
};

const apiRoutes = [
    "administrators",
    "appointments",
    "auth",
    "beds",
    "departments",
    "doctors",
    "hospitals",
    "messages",
    "nurses",
    "patients",
    "payments",
    "profiles",
    "referrals",
    "reset-password",
    "roles",
    "specializations",
    "staff",
    "upload",
    "users",
];

export default async function ApiLandingPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center py-12">
            {/* Side Bar */}
            <div className="shadow-lg shadow-gray-300 fixed top-6 left-6 w-[300px] h-[95%] bg-bluelight rounded-2xl p-4 flex flex-col items-center">
                <div className="bg-secondary p-4 mb-8 w-[300px] h-[80px]">
                    {/* Logo Image */}
                    <Link href="/api-landing">
                        <img
                            src="/images/logo.png"
                            alt="Snark Health Logo"
                            width={120}
                            height={80}
                            className="cursor-pointer mb-4"
                            loading="lazy"
                        />
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-secondary mb-4">
                    SnarkHealth API
                </h1>
                <p className="mt-auto font-semibold text-secondary">
                    Version 1.0
                </p>
            </div>

            <div>
                <div className="ml-[340px] p-6 m-4 rounded-2xl bg-secondary">
                    <p className="text-lg text-white mb-8 max-w-5xl">
                        This page provides an overview of available API
                        endpoints. Click on the links below to view data from
                        specific endpoints.
                    </p>
                </div>

                {/* Links to API Endpoints */}
                <div className="ml-[340px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-bluelight p-6 m-4 rounded-2xl overflow-y-auto">
                    {apiRoutes.map((route) => (
                        <Link
                            key={route}
                            href={`/api-viewer?path=${route}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="p-8 border rounded-2xl shadow hover:shadow-lg bg-white text-center hover:bg-blue-50 transition flex flex-col items-center">
                                <div className="text-4xl text-primary mb-2">
                                    {routeIcons[route]}
                                </div>
                                <p className="text-lg capitalize font-semibold text-primary">
                                    {route}
                                </p>
                                <p className="text-sm text-gray-600">
                                    View data for <code>{route}</code>
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
