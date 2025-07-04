// src/components/ui/graph-tooltip.tsx

import React from "react";

interface GraphTooltipProps {
    active?: boolean;
    payload?: {
        value: number;
        payload: {
            month: string;
            Count: number;
        };
    }[];
    label?: string;
}

const GraphTooltip: React.FC<GraphTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    const data = payload[0].payload;

    return (
        <div className="bg-slate-two p-3 rounded-[10px] shadow-md">
            <p className="font-semibold text-sm text-text-main">
                {data.month}
            </p>
            <p className="text-sm text-text-muted">
                Patient Count: <span className="font-medium">{data.Count}</span>
            </p>
        </div>
    );
};

export default GraphTooltip;