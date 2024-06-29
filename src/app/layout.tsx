// src/app/layout.tsx

import "../styles/global.css";
import type { Metadata } from "next";
import { inter } from '@/components/ui/fonts';
import SessionWrapper from "@/components/SessionWrapper";
import { UserProvider } from "@/app/context/UserContext";
import { LoadingProvider } from "@/app/context/LoadingContext";
import { SearchProvider } from "@/app/context/SearchContext";

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
        <SessionWrapper>
            <UserProvider>
                <LoadingProvider>
                    <SearchProvider>
                        <html lang="en">
                        <body className={`${inter.className} antialiased`}>
                                <main>
                                    {children}
                                </main>
                            </body>
                        </html>
                    </SearchProvider>
                </LoadingProvider>
            </UserProvider>
        </SessionWrapper>
    );
}
