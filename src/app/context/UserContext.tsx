// src/context/UserContext.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { User } from "@/lib/definitions";

interface UserContextType {
    user: User | null;
    hospitalId: number | null;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [hospitalId, setHospitalId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchUser = async () => {
            if (session?.user) {
                const userId = session.user.id;

                try {
                    const response = await fetch(`/api/users/${userId}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch user data: ${response.statusText}`);
                    }
                    const userData = await response.json();

                    // console.log(userData)

                    setUser(userData);
                    setHospitalId(userData.hospitalId || null);
                } catch (error) {
                    setError('Error fetching user data.');
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUser();
    }, [session]);

    return (
        <UserContext.Provider value={{ user, hospitalId, error }}>
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
