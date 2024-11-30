// src/components/ui/LoadingDots.tsx

"use client";

import React from "react";

const LoadingDots: React.FC = () => {
    return (
        <div className="flex items-center justify-center space-x-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-200" />
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-400" />
        </div>
    );
};

export default LoadingDots;
