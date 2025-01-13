// src/lib/queryClient.ts

import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1, // Retry failed requests once
            refetchOnWindowFocus: false, // Disable refetch on window focus
            staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
        },
    },
});

export default queryClient;
