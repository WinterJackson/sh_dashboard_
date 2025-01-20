// File: src/components/ui/graph-tooltip.tsx

import React from "react";

interface GraphTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
        payload: {
            month: string;
            count: number;
        };
    }[];
    label?: string;
}

const GraphTooltip: React.FC<GraphTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0].payload; // Access the data for the hovered bar

    return (
        <div className="bg-blue-100/95 p-3 rounded-[10px] shadow-md">
            <p className="font-semibold text-sm text-gray-800">
                {data.month}
            </p>
            <p className="text-sm text-gray-600">
                Patient Count: <span className="font-medium">{data.count}</span>
            </p>
        </div>
    );
};

export default GraphTooltip;