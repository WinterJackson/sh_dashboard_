// src/context/UserContext.tsx

"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/lib/definitions";

interface UserContextType {
    user: User | null;
    hospitalId: number | null;
    error: string | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    setHospitalId: React.Dispatch<React.SetStateAction<number | null>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
    children,
    initialUser,
    initialHospitalId,
    initialError,
}: {
    children: ReactNode;
    initialUser: User | null;
    initialHospitalId: number | null;
    initialError: string | null;
}) => {
    const [user, setUser] = useState<User | null>(initialUser);
    const [hospitalId, setHospitalId] = useState<number | null>(initialHospitalId);
    const [error, setError] = useState<string | null>(initialError);

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
