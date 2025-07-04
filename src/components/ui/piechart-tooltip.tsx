// src/components/ui/piechart-tooltip.tsx

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

    const data = payload[0].payload;

    return (
        <div className="bg-slate-two p-3 rounded-[10px] shadow-md">
            <p className="font-semibold text-sm text-text-main">
                {data.name}
            </p>
            <p className="text-sm text-text-muted">
                Value: <span className="font-medium">{data.value}</span>
            </p>
            <p className="text-sm text-text-muted">
                Percentage:{" "}
                <span className="font-medium">{data.percentage}%</span>
            </p>
        </div>
    );
};

export default CustomTooltip;