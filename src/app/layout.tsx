// src/app/layout.tsx

import { LoadingProvider } from "@/app/context/LoadingContext";
import { SearchProvider } from "@/app/context/SearchContext";
import { UserProvider } from "@/app/context/UserContext";
import ErrorBoundaryWrapper from "@/components/providers/ErrorBoundaryWrapper"; // Import wrapper
import NotFoundBoundary from "@/components/providers/NotFoundBoundary";
import SessionWrapper from "@/components/providers/SessionWrapper";
import { inter } from "@/components/ui/fonts";
import ClientQueryProvider from "@/components/providers/ClientQueryProvider";
import type { Metadata } from "next";
import "../styles/global.css";
import { EdgeStoreProvider } from "@/lib/edgestore";

export const metadata: Metadata = {
    title: "Hospital Dashboard",
    description: "Hospital Dashboard",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotFoundBoundary>
            <html lang="en">
                <body className={`${inter.className} antialiased`}>
                    <SessionWrapper>
                        <ErrorBoundaryWrapper>
                            <ClientQueryProvider>
                                <UserProvider>
                                    <LoadingProvider>
                                        <SearchProvider>
                                            <EdgeStoreProvider>
                                                <main>{children}</main>
                                            </EdgeStoreProvider>
                                        </SearchProvider>
                                    </LoadingProvider>
                                </UserProvider>
                            </ClientQueryProvider>
                        </ErrorBoundaryWrapper>
                    </SessionWrapper>
                </body>
            </html>
        </NotFoundBoundary>
    );
}
