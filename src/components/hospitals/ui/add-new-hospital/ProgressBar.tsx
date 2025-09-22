// src/components/hospitals/ui/add-new-hospital/ProgressBar.tsx

"use client";

import React from "react";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    currentStep,
    totalSteps,
}) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
                <div className="w-full bg-background rounded-full h-2.5">
            <div
                className="bg-primary h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
