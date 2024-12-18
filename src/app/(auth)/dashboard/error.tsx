"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { getErrorMessage } from "@/hooks/getErrorMessage";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Get a descriptive error message
        const errorMessage = getErrorMessage(error);

        // Log the error to an error reporting service
        Sentry.captureException(error, {
            extra: { errorMessage },
        });

        console.error(errorMessage);
    }, [error]);

    return (
        <div>
            <h2>Error in dashboard page!</h2>
            <p>{getErrorMessage(error)}</p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    );
}
