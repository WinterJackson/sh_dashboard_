// File: src/components/dashboard/ui/ServicesDataCard.tsx

"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useFetchHospitalServices } from "@/hooks/useFetchHospitalServices";
import { Role } from "@/lib/definitions";
import Link from "next/link";
import CustomTooltip from "@/components/ui/piechart-tooltip";

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
            role: Role;
            hospitalId: number | null;
        };
    };
}

// Custom label renderer
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

    // Break name into lines for text wrapping
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
    const user = session?.user
        ? { role: session.user.role, hospitalId: session.user.hospitalId }
        : undefined;

    const { data, isLoading, isError } = useFetchHospitalServices(user);

    if (isLoading) {
        return (
            <div className="p-8 bg-white rounded-lg shadow-md">Loading...</div>
        );
    }

    if (isError || !data) {
        return (
            <div className="p-8 bg-white rounded-lg shadow-md">
                Failed to load hospital services data.
            </div>
        );
    }

    // Process the data: Sort by value and pick the top 7
    const top7Data = [...data]
        .sort((a, b) => b.value - a.value) // Sort by value in descending order
        .slice(0, 7); // Take the top 7 services

    // Calculate the total value of the top 7
    const top7Total = top7Data.reduce((sum, service) => sum + service.value, 0);

    // Adjust percentages for the top 7 based on the new total
    const processedData = top7Data.map((service) => ({
        name: service.name,
        value: service.value,
        percentage: ((service.value / top7Total) * 100).toFixed(2), // Recalculate percentage
    }));

    return (
        <div className="flex flex-col p-6 w-full rounded-2xl xl:pb-5 bg-slate-100 shadow-lg shadow-gray-300">
            <h1 className="mb-6 mt-4 text-sm xl:text-base font-semibold">
                Hospital Services
            </h1>
            <div className="flex items-center w-full">
                {/* Pie Chart */}
                <div className="w-1/2 p-2 h-auto">
                    <span className="text-sm xl:text-base font-semibold p-2">
                        Pie Chart
                    </span>
                    <div className="w-full h-[300px]">
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
                    </div>
                </div>

                {/* Legend */}
                <div className="w-1/2 p-2 h-auto">
                    <span className="text-sm xl:text-base font-semibold p-1">
                        Services
                    </span>
                    <div className="space-y-4 overflow-x-auto p-2 scrollbar-custom w-full">
                        {processedData.map((entry, index) => (
                            <div
                                key={entry.name}
                                className="grid grid-cols-[5px_1fr_15px] min-w-[260px] items-center gap-4 bg-gray-200 rounded-[5px] p-1"
                            >
                                {/* Color Index Column */}
                                <div
                                    className="w-3 h-3 rounded-full flex-shrink-0 justify-center"
                                    style={{
                                        backgroundColor:
                                            COLORS[index % COLORS.length],
                                    }}
                                ></div>

                                {/* Name Column */}
                                <div className="flex justify-start overflow-hidden">
                                    <span className="text-sm font-medium whitespace-nowrap truncate">
                                        {entry.name}
                                    </span>
                                </div>

                                {/* Percentage Column */}
                                <div className="flex justify-end">
                                    <span className="text-sm text-gray-600 whitespace-nowrap">
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
                className="w-[60px] text-sm xl:text-sm text-primary hover:bg-primary hover:text-white rounded-[5px] p-1 mt-2 justify-items-center"
            >
                View all
            </Link>
        </div>
    );
}
