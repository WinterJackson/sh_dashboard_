// File: src/components/ui/piechart-tooltip.tsx

import React from "react";

interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
        payload: {
            name: string;
            value: number;
            percentage: string;
        };
    }[];
    label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0].payload; // Access the data for the hovered segment

    return (
        <div className="bg-blue-100/95 p-3 rounded-[10px] shadow-md">
            <p className="font-semibold text-sm text-gray-800">
                {data.name}
            </p>
            <p className="text-sm text-gray-600">
                Value: <span className="font-medium">{data.value}</span>
            </p>
            <p className="text-sm text-gray-600">
                Percentage:{" "}
                <span className="font-medium">{data.percentage}%</span>
            </p>
        </div>
    );
};

export default CustomTooltip;