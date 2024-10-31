// src/hooks/useSessionData.ts

import { useSession } from "next-auth/react";

export const useSessionData = () => {
    const { data: session } = useSession();

    return session;
};