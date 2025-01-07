// src/app/global-error.tsx

'use client';

import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";
import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  // Get a descriptive error message
  const errorMessage = getErrorMessage(error);

  useEffect(() => {
    Sentry.captureException(error, {
      extra: { errorMessage },
    });
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{errorMessage}</p>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
