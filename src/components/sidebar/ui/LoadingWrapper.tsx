// File: src/components/ui/LoadingWrapper.tsx

"use client";

import { useState } from "react";
import LoadingSpinner from "./../../ui/loading";

interface LoadingWrapperProps {
    children: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            {isLoading && <LoadingSpinner />}
            <div
                onMouseEnter={() => setIsLoading(true)}
                onMouseLeave={() => setIsLoading(false)}
            >
                {children}
            </div>
        </>
    );
};

export default LoadingWrapper;
