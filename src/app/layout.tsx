// src/app/layout.tsx

import "../styles/global.css";
import type { Metadata } from "next";
import { inter } from '@/components/ui/fonts';
import SessionWrapper from "@/components/SessionWrapper";
import { UserProvider } from "@/app/context/UserContext";
import { LoadingProvider } from "@/app/context/LoadingContext";
import { SearchProvider } from "@/app/context/SearchContext";
import { getSession, getUserProfile } from "@/lib/session";
import { EdgeStoreProvider } from "../lib/edgestore";

export const metadata: Metadata = {
    title: "Hospital Dashboard",
    description: "Hospital Dashboard",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch session data and user profile
    const session = await getSession();
    const userProfile = session?.user ? await getUserProfile(session.user.id) : null;

    const initialUser = userProfile || null;
    const initialHospitalId = userProfile?.hospitalId || null;
    const initialError = session
        ? null
        : "User session could not be fetched or profile could not be retrieved.";

    return (
        <SessionWrapper>
            <UserProvider
                initialUser={initialUser}
                initialHospitalId={initialHospitalId}
                initialError={initialError}
            >
                <LoadingProvider>
                    <SearchProvider>
                        <EdgeStoreProvider>
                            <html lang="en">
                                <body className={`${inter.className} antialiased`}>
                                    <main>{children}</main>
                                </body>
                            </html>
                        </EdgeStoreProvider>
                    </SearchProvider>
                </LoadingProvider>
            </UserProvider>
        </SessionWrapper>
    );
}
