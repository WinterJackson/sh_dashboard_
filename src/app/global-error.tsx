
// src/app/global-error.tsx

'use client'

import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/hooks/getErrorMessage";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Get a descriptive error message
  const errorMessage = getErrorMessage(error);

  // Log the error to Sentry with the descriptive message
  Sentry.captureException(error, {
    extra: { errorMessage }
  });

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <p>{errorMessage}</p>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
