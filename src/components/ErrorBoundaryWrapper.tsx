// src/components/ErrorBoundaryWrapper.tsx

"use client";

import { ErrorBoundary } from "@sentry/react";

export default function ErrorBoundaryWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ErrorBoundary
            fallback={
                <div className="flex items-center justify-center h-screen">
                    <h1>
                        An unexpected error occurred. Please try again later.
                    </h1>
                    <button onClick={() => window.location.reload()}>
                        Retry
                    </button>
                </div>
            }
            showDialog
        >
            {children}
        </ErrorBoundary>
    );
}
