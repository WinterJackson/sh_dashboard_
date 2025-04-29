// File: src/components/dashboard/ui/ServicesDataCard.tsx

"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Hospital, Role } from "@/lib/definitions";
import Link from "next/link";
import CustomTooltip from "@/components/ui/piechart-tooltip";
import { useFetchHospitals } from "@/hooks/useFetchHospitals";
import { useFetchHospitalServices } from "@/hooks/useFetchHospitalServices";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1919",
    "#19FFAF",
];

interface ServicesDataCardProps {
    session: {
        user: {
            userId: string;
            role: Role;
            hospitalId: number | null;
        };
    };
}

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
}: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
}) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const wrappedName = name.split(" ").slice(0, 2).join("\n");

    return (
        <text
            x={x}
            y={y}
            fill="black"
            fontWeight={500}
            fontSize="12px"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {wrappedName.split("\n").map((line, index) => (
                <tspan key={index} x={x} dy={index * 1.2 + "em"}>
                    {line}
                </tspan>
            ))}
        </text>
    );
};

export default function ServicesDataCard({ session }: ServicesDataCardProps) {
    const { userId, role: userRole, hospitalId: userHospitalId } = session.user;
    const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
        null
    );

    // Fetch hospitals for SUPER_ADMIN
    const {
        data: hospitals = [] as Hospital[],
        isLoading: isHospitalsLoading,
        isError: isHospitalsError,
    } = useFetchHospitals(
        userRole === Role.SUPER_ADMIN
            ? { role: userRole, hospitalId: userHospitalId, userId }
            : undefined
    );

    // Get hospital ID for services fetch
    const targetHospitalId =
        userRole === Role.SUPER_ADMIN ? selectedHospitalId : userHospitalId;

    // Fetch services data
    const {
        data: servicesData = [],
        isLoading: isServicesLoading,
        isError: isServicesError,
    } = useFetchHospitalServices({
        role: userRole,
        hospitalId: targetHospitalId,
    });

    const isLoading =
        (userRole === Role.SUPER_ADMIN && isHospitalsLoading) ||
        isServicesLoading;
    const isError = isHospitalsError || isServicesError;

    // Name of hospital being displayed
    const displayedHospitalName =
        userRole === Role.SUPER_ADMIN
            ? selectedHospitalId
                ? hospitals.find((h) => h.hospitalId === selectedHospitalId)
                      ?.hospitalName || "All Hospitals"
                : "All Hospitals"
            : null;

    // Memoize the processed data for the PieChart
    const processedData = useMemo(() => {
        if (!servicesData || servicesData.length === 0) return [];

        const top7Data = [...servicesData]
            .sort((a, b) => b.value - a.value) // Sort by value in descending order
            .slice(0, 7); // Take the top 7 services

        const top7Total = top7Data.reduce((sum, service) => sum + service.value, 0);

        return top7Data.map((service) => ({
            name: service.name,
            value: service.value,
            percentage: ((service.value / top7Total) * 100).toFixed(2), // Recalculate percentage
        }));
    }, [servicesData]);

    if (isError || !servicesData) {
        return (
            <div className="p-8 bg-slate-100 rounded-2xl shadow-lg shadow-gray-300">
                Failed to load hospital services data.
            </div>
        );
    }

    return (
        <div className="flex flex-col p-4 w-full rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <div className="flex justify-between items-center mb-6 mt-6">
                <h1 className="text-sm xl:text-base font-semibold whitespace-nowrap">
                    Hospital Services
                </h1>

                {userRole === Role.SUPER_ADMIN && (
                    <div className="flex items-center">
                        {/* DropdownMenu for hospitals */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="group">
                                <button className="bg-bluelight/5 flex items-center justify-between p-2 border rounded max-w-[200px] text-sm text-right truncate">
                                    <span className="truncate">
                                        {selectedHospitalId
                                            ? hospitals.find(
                                                  (h) =>
                                                      h.hospitalId ===
                                                      selectedHospitalId
                                              )?.hospitalName || "All Hospitals"
                                            : "All Hospitals"}
                                    </span>
                                    <ChevronRight className="h-4 w-4 ml-2 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px] rounded-[5px]">
                                <DropdownMenuItem
                                    onClick={() => setSelectedHospitalId(null)}
                                    className="cursor-pointer bg-bluelight rounded-[5px] mb-2"
                                >
                                    All Hospitals
                                </DropdownMenuItem>
                                {hospitals.map((hospital) => (
                                    <DropdownMenuItem
                                        key={hospital.hospitalId}
                                        onClick={() =>
                                            setSelectedHospitalId(
                                                hospital.hospitalId
                                            )
                                        }
                                        className="cursor-pointer rounded-[5px] mb-1"
                                    >
                                        {hospital.hospitalName}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            {/* hospital name */}
            {userRole === Role.SUPER_ADMIN && (
                <div className="mb-4">
                    <p className="text-sm p-2 bg-bluelight/5 rounded-[5px]">
                        <span>Data for: </span>
                        <span className="font-medium">{displayedHospitalName}</span>
                    </p>
                </div>
            )}

            <div className="flex items-center w-full">
                <div className="w-1/2 p-2 pl-0">
                    <span className="text-sm xl:text-base font-semibold p-2 pl-0">
                        Pie Chart
                    </span>
                    <div className="w-full h-[310px] relative rounded-[10px] bg-slate-200">
                        {isLoading ? (
                            <Skeleton className="w-full h-full absolute inset-0" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={processedData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={renderCustomizedLabel}
                                    >
                                        {processedData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="w-1/2 p-2 pr-0">
                    <span className="text-sm xl:text-base font-semibold p-1">
                        Services
                    </span>
                    <div className="space-y-4 overflow-x-auto p-2 scrollbar-custom w-full">
                        {isLoading ? (
                            Array.from({ length: 7 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-[5px_1fr_15px] min-w-[260px] items-center gap-3 bg-slate-200 rounded-[5px] p-1"
                                >
                                    <Skeleton className="w-3 h-2 rounded-full" />
                                    <Skeleton className="h-2 w-[80%]" />
                                    <Skeleton className="h-2 w-[20%]" />
                                </div>
                            ))
                        ) : (
                            processedData.map((entry, index) => (
                                <div
                                    key={entry.name}
                                    className="grid grid-cols-[5px_1fr_15px] min-w-[260px] items-center gap-4 bg-slate-200 rounded-[5px] p-1"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{
                                            backgroundColor:
                                                COLORS[index % COLORS.length],
                                        }}
                                    ></div>
                                    <div className="flex justify-start overflow-hidden">
                                        <span className="text-sm font-medium whitespace-nowrap truncate">
                                            {entry.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-end">
                                        <span className="text-sm text-gray-600 whitespace-nowrap">
                                            {entry.percentage}%
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <Link
                href=""
                className="w-[60px] text-sm xl:text-sm text-primary hover:bg-primary hover:text-white rounded-[5px] p-1 mt-2"
            >
                View all
            </Link>
        </div>
    );
}
