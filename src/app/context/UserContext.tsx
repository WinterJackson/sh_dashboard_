// src/context/UserContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { fetchUserProfile, UserProfile } from "@/lib/data-access/user/data";

interface UserContextType {
    user: UserProfile | null;
    hospitalId: number | null;
    error: string | null;
    setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    setHospitalId: React.Dispatch<React.SetStateAction<number | null>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [hospitalId, setHospitalId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                if (session?.user) {
                    const profile = await fetchUserProfile(session.user.id);
                    setUser(profile);
                    setHospitalId(profile.hospitalId || null);
                } else {
                    setError("User session is missing.");
                }
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("An error occurred while fetching user profile.");
            }
        };

        loadUserProfile();
    }, [session]);

    return (
        <UserContext.Provider value={{ user, hospitalId, error, setUser, setHospitalId, setError }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
