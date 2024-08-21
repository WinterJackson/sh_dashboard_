// src/hooks/useSessionData.ts

import { useSession } from "next-auth/react";

export const useSessionData = () => {
    const { data: session } = useSession();

    console.log("Session data:", session);

    return session;
};