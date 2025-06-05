// src/components/WelcomeToast.tsx

"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export const WelcomeToast = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { toast } = useToast();
    const hasFired = useRef(false);

    useEffect(() => {
        if (!hasFired.current && searchParams.get("welcome") === "true") {
            hasFired.current = true;
            toast({
                title: "Welcome!",
                description: "You have successfully signed in.",
                duration: 30000,
            });
            router.replace(window.location.pathname);
        }
    }, [searchParams, toast, router]);

    return null;
};

