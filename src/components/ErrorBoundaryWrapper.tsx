// src/components/ErrorBoundaryWrapper.tsx

"use client";

import { ErrorBoundary } from "@sentry/react";

export default function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary
            fallback={
                <div className="flex items-center justify-center h-screen">
                    <h1>Something went wrong. Please try again later.</h1>
                </div>
            }
            showDialog
        >
            {children}
        </ErrorBoundary>
    );
}
