// src/app/layout.tsx

import "../styles/global.css";
import type { Metadata } from "next";
import { inter } from "@/components/ui/fonts";
import SessionWrapper from "@/components/SessionWrapper";
import { UserProvider } from "@/app/context/UserContext";
import { LoadingProvider } from "@/app/context/LoadingContext";
import { SearchProvider } from "@/app/context/SearchContext";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getUserProfile } from "@/lib/session";
import { EdgeStoreProvider } from "@/lib/edgestore";
import ErrorBoundaryWrapper from "@/components/ErrorBoundaryWrapper"; // Import wrapper
import NotFoundBoundary from "@/components/NotFoundBoundary";

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
                        <UserProvider>
                            <LoadingProvider>
                                <SearchProvider>
                                    <EdgeStoreProvider>
                                        <ErrorBoundaryWrapper>
                                            <main>{children}</main>
                                        </ErrorBoundaryWrapper>
                                    </EdgeStoreProvider>
                                </SearchProvider>
                            </LoadingProvider>
                        </UserProvider>
                    </SessionWrapper>
                </body>
            </html>
        </NotFoundBoundary>
    );
}
