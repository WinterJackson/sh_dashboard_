// src/hooks/useFetchAllUsers.ts

import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/definitions";

async function fetchAllUsers(): Promise<User[]> {
    const response = await fetch("/api/users");
    if (!response.ok) {
        throw new Error("Failed to fetch users");
    }
    return response.json();
}

export function useFetchAllUsers() {
    return useQuery<User[], Error>({
        queryKey: ["allUsers"],
        queryFn: fetchAllUsers,
    });
}
