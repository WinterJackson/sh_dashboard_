// src/components/providers/ClientQueryProvider.tsx

"use client";

import React, { useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SocketProvider from "./SocketProvider";

export default function ClientQueryProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                        staleTime: 1000 * 60 * 5,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <SocketProvider>{children}</SocketProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
