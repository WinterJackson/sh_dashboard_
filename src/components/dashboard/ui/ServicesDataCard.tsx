// File: src/components/dashboard/ui/ServicesDataCard.tsx

"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: "Maternity", value: 148, percentage: "10.33%" },
    { name: "Pediatrics", value: 67, percentage: "4.19%" },
    { name: "Dialysis", value: 60, percentage: "10.33%" },
    { name: "Nutrition", value: 36, percentage: "4.19%" },
    { name: "Mental Health", value: 21, percentage: "10.33%" },
    { name: "Special Care", value: 12, percentage: "4.19%" },
    { name: "Pharmacy", value: 5, percentage: "10.33%" },
];

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1919",
    "#19FFAF",
];

export default function ServicesDataCard() {
    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Hospital Services</h1>
            <div className="flex items-center">
                {/* Pie Chart on the Left */}
                <div className="w-1/2 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60} // Hollow center
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend on the Right */}
                <div className="w-1/2 pl-8">
                    <div className="space-y-4">
                        {data.map((entry, index) => (
                            <div key={entry.name} className="flex items-center">
                                <div
                                    className="w-4 h-4 rounded-full mr-3"
                                    style={{ backgroundColor: COLORS[index] }}
                                ></div>
                                <div className="flex-1">
                                    <span className="text-sm font-medium">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-600">
                                    {entry.percentage}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
