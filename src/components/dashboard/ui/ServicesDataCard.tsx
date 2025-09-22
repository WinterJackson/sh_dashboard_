// src/components/dashboard/ui/ServicesDataCard.tsx

"use client";

import React, { useState, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Hospital, Role } from "@/lib/definitions";
import Link from "next/link";
import CustomTooltip from "@/components/ui/piechart-tooltip";
import { useFetchHospitals } from "@/hooks/useFetchHospitals";
import { useFetchHospitalServices } from "@/hooks/useFetchHospitalServices";
import { ChevronRight, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Tooltip as UiTooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { HospitalCombobox } from "@/components/ui/hospital-combobox";

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
            fill="hsl(var(--foreground))"
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

const ServicesDataCard: React.FC<ServicesDataCardProps> = ({ session }) => {
    const { userId, role: userRole, hospitalId: userHospitalId } = session.user;
    const [selectedHospitalId, setSelectedHospitalId] = useState<number | null>(
        null
    );

    const {
        data: hospitals = [] as Hospital[],
        isLoading: isHospitalsLoading,
        isError: isHospitalsError,
    } = useFetchHospitals(
        userRole === Role.SUPER_ADMIN
            ? { role: userRole, hospitalId: userHospitalId, userId }
            : undefined
    );

    const targetHospitalId: number | null =
        userRole === Role.SUPER_ADMIN ? selectedHospitalId : userHospitalId;

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

    const displayedHospitalName =
        userRole === Role.SUPER_ADMIN
            ? selectedHospitalId
                ? hospitals.find((h) => h.hospitalId === selectedHospitalId)
                      ?.hospitalName || "All Hospitals"
                : "All Hospitals"
            : null;

    const processedData = useMemo(() => {
        if (!servicesData || servicesData.length === 0) return [];

        const top7Data = [...servicesData]
            .sort((a, b) => b.value - a.value)
            .slice(0, 7);

        const top7Total = top7Data.reduce(
            (sum, service) => sum + service.value,
            0
        );

        return top7Data.map((service) => ({
            name: service.name,
            value: service.value,
            percentage: ((service.value / top7Total) * 100).toFixed(2),
        }));
    }, [servicesData]);

    if (isError || !servicesData) {
        return (
            <div className="p-8 bg-card rounded-2xl shadow-lg shadow-shadow-main">
                Failed to load hospital services data.
            </div>
        );
    }

    return (
        <div className="flex flex-col p-4 w-full rounded-2xl bg-card shadow-main-lg cursor-pointer">
            <div className="flex justify-between items-center mb-6 mt-6">
                {userRole === Role.SUPER_ADMIN && (
                    <div className="flex items-center w-[250px]">
                        <HospitalCombobox
                            hospitals={hospitals}
                            isLoading={isHospitalsLoading}
                            selectedHospitalId={selectedHospitalId}
                            onSelectHospitalId={(id) =>
                                setSelectedHospitalId(id)
                            }
                            className="w-full border bg-background-muted/50 hover:bg-background-muted/80"
                            defaultLabel="All Hospitals"
                            popoverWidthClass="w-[250px]"
                        />
                    </div>
                )}
                <h1 className="text-xs sm:text-sm md:text-sm lg:text-base font-semibold whitespace-nowrap">
                    Hospital Services
                </h1>
            </div>

            {userRole === Role.SUPER_ADMIN && (
                <div className="mb-4">
                    <p className="text-xs sm:text-sm p-2 bg-slate rounded-[5px]">
                        <span>Data for: </span>
                        <span className="font-semibold">
                            {displayedHospitalName}
                        </span>
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 items-start w-full p-2 gap-6">
                <div className="w-full p-2 pl-0">
                    <span className="text-xs sm:text-sm md:text-sm lg:text-base font-semibold p-2 pl-0 flex items-center gap-1">
                        Pie Chart
                        <TooltipProvider>
                            <UiTooltip>
                                <TooltipTrigger asChild>
                                    <Info
                                        size={14}
                                        className="text-text-muted"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-normal">
                                        Shows a proportional breakdown of the
                                        top 7 most frequent hospital services
                                        based on usage count.
                                    </p>
                                </TooltipContent>
                            </UiTooltip>
                        </TooltipProvider>
                    </span>
                    <div className="w-full h-[310px] relative rounded-[10px] bg-slate">
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
                                        fill="hsl(var(--primary))"
                                        dataKey="value"
                                        nameKey="name"
                                        label={renderCustomizedLabel}
                                    >
                                        {processedData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                <div className="w-full p-2 pr-0">
                    <span className="text-xs sm:text-sm md:text-sm lg:text-base font-semibold p-1 flex items-center gap-1">
                        Services
                        <TooltipProvider>
                            <UiTooltip>
                                <TooltipTrigger asChild>
                                    <Info
                                        size={14}
                                        className="text-text-muted"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-normal">
                                        Lists each of the top 7 services along
                                        with their individual contribution
                                        percentage.
                                    </p>
                                </TooltipContent>
                            </UiTooltip>
                        </TooltipProvider>
                    </span>
                    <div className="space-y-4 overflow-x-auto p-2 scrollbar-custom w-full">
                        {isLoading
                            ? Array.from({ length: 7 }).map((_, index) => (
                                  <div
                                      key={index}
                                      className="grid grid-cols-[5px_1fr_15px] min-w-[200px] sm:min-w-[240px] md:min-w-[260px] items-center gap-3 bg-slate rounded-[5px] p-1"
                                  >
                                      <Skeleton className="w-3 h-2 rounded-full" />
                                      <Skeleton className="h-2 w-[80%]" />
                                      <Skeleton className="h-2 w-[20%]" />
                                  </div>
                              ))
                            : processedData.map((entry, index) => (
                                  <div
                                      key={entry.name}
                                      className="grid grid-cols-[5px_1fr_15px] min-w-[200px] sm:min-w-[240px] md:min-w-[260px] items-center gap-4 bg-slate rounded-[5px] p-1"
                                  >
                                      <div
                                          className="w-3 h-3 rounded-full flex-shrink-0"
                                          style={{
                                              backgroundColor:
                                                  COLORS[index % COLORS.length],
                                          }}
                                      ></div>
                                      <div className="flex justify-start overflow-hidden">
                                          <span className="text-xs sm:text-sm font-medium text-text-main whitespace-nowrap max-w-[170px] truncate">
                                              {entry.name}
                                          </span>
                                      </div>
                                      <div className="flex justify-end">
                                          <span className="text-xs sm:text-sm text-text-muted whitespace-nowrap">
                                              {entry.percentage}%
                                          </span>
                                      </div>
                                  </div>
                              ))}
                    </div>
                </div>
            </div>

            <Link
                href=""
                className="w-[70px] justify-center text-xs sm:text-sm text-primary hover:bg-primary hover:text-primary-foreground rounded-[5px] p-1 m-2"
            >
                View all
            </Link>
        </div>
    );
};

export default React.memo(ServicesDataCard);
