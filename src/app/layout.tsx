// src/app/layout.tsx

import { LoadingProvider } from "@/app/context/LoadingContext";
import { SearchProvider } from "@/app/context/SearchContext";
import { UserProvider } from "@/app/context/UserContext";
import ErrorBoundaryWrapper from "@/components/providers/ErrorBoundaryWrapper";
import NotFoundBoundary from "@/components/providers/NotFoundBoundary";
import SessionWrapper from "@/components/providers/SessionWrapper";
import { inter } from "@/components/ui/fonts";
import ClientQueryProvider from "@/components/providers/ClientQueryProvider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Toaster } from "@/components/ui/toaster";
import ThemeClient from "@/components/ThemeClient";
import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
    title: "Hospital Dashboard",
    description: "Hospital Dashboard",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <NotFoundBoundary>
            <html lang="en">
                <body
                    className={`${inter.className} antialiased min-h-screen bg-[radial-gradient(125%_125%_at_50%_10%,hsl(var(--background))_40%,hsl(var(--primary))_80%)]`}
                >
                    <ThemeClient />
                    <SessionWrapper>
                        <ErrorBoundaryWrapper>
                            <ClientQueryProvider>
                                <UserProvider>
                                    <LoadingProvider>
                                        <SearchProvider>
                                            <EdgeStoreProvider>
                                                <main>{children}</main>
                                                <Toaster />
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
