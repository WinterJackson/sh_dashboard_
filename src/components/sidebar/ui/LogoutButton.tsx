// File: src/components/ui/LogoutButton.tsx

"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingSpinner from "../../ui/loading";
import { ExitIcon } from "@radix-ui/react-icons";

const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await signOut({ callbackUrl: "/sign-in" });
            router.replace("/sign-in");
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex max-w-[110px] py-1 px-2 bg-slate-100 items-center rounded-[10px] shadow-sm shadow-gray-400 gap-2 group hover:bg-primary">
            <ExitIcon
                className={`text-base ${
                    isLoading ? "text-gray-400" : "text-primary group-hover:text-white"
                }`}
            />
            <button
                className={`py-1 px-1 text-primary whitespace-nowrap group-hover:text-white ${
                    isLoading ? "cursor-not-allowed text-gray-400" : "hover:text-white"
                }`}
                onClick={handleLogout}
                disabled={isLoading}
            >
                Log Out
            </button>
            {isLoading && <LoadingSpinner />}
        </div>
    );
};

export default LogoutButton;
