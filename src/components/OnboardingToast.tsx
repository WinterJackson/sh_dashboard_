// src/components/OnboardingToast.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const OnboardingToast = () => {
    const { data: session } = useSession();
    const { toast, dismiss } = useToast();
    const [toastId, setToastId] = useState<string | null>(null);
    const hasChecked = useRef(false);
    const pathname = usePathname();

    // 1️⃣ Show once when we detect incomplete onboarding
    useEffect(() => {
        if (hasChecked.current) return;

        const needsOnboarding = session?.user?.hasCompletedOnboarding === false;
        if (needsOnboarding && !toastId) {
            const { id } = toast({
                title: "Account Setup Required",
                description: (
                    <div className="flex flex-col gap-2">
                        <p>
                            Please complete your profile in Settings to
                            continue.
                        </p>
                        <div className="flex gap-2">
                            <Link
                                href="/dashboard/settings"
                                className="text-primary font-semibold hover:underline"
                                onClick={() => id && dismiss(id)}
                            >
                                Go to Settings
                            </Link>
                            <button
                                onClick={() => id && dismiss(id)}
                                className="text-sm underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                ),
                duration: 60000,
                variant: "destructive",
            });
            setToastId(id);
            hasChecked.current = true;
        }
    }, [session?.user?.hasCompletedOnboarding, toast, dismiss, toastId]);

    // 2️⃣ Dismiss on completion or when user lands on Settings
    useEffect(() => {
        if (!toastId) return;
        const completed = session?.user?.hasCompletedOnboarding === true;
        const onSettings = pathname === "/dashboard/settings";
        if (completed || onSettings) {
            dismiss(toastId);
            setToastId(null);
        }
    }, [session?.user?.hasCompletedOnboarding, pathname, dismiss, toastId]);

    // 3️⃣ Cleanup on unmount
    useEffect(
        () => () => {
            if (toastId) dismiss(toastId);
        },
        [toastId, dismiss]
    );

    return null;
};

