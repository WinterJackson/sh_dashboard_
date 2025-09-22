// src/components/providers/SocketProvider.tsx

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [socket] = useState<Socket>(() => io("http://localhost:3001", {
        withCredentials: true,
        autoConnect: false,
    }));

    useEffect(() => {
        const isMessagingRoute = pathname?.startsWith("/dashboard/messaging");

        if (isMessagingRoute) {
            console.log("🔌 Connecting socket...");
            socket.connect();
        } else {
            console.log("❌ Disconnecting socket...");
            socket.disconnect();
        }
    }, [pathname, socket]);

    useEffect(() => {
        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
