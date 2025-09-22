// src/app/(auth)/dashboard/settings/tabs/SupportTab.tsx

"use client";

import FAQ from "@/components/settings/FAQs/FAQ";
import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function SupportTabContent() {
    return (
        <div className="flex flex-col md:flex-row gap-5 h-full p-4 bg-card rounded-[10px] shadow-md">
            {/* left */}
            <div className="flex justify-center items-center h-full w-full md:w-1/2 p-4 md:p-10 border-b-4 md:border-b-0 md:border-r-4">
                <Image
                    src="/images/amico.svg"
                    alt="Support illustration"
                    width={500}
                    height={500}
                />
            </div>
            {/* right */}
            <div className="flex h-full w-full md:w-1/2 pt-7">
                <div className="flex flex-col gap-7 w-full">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-primary capitalize font-semibold bg-slate p-2 rounded-[10px] shadow-sm shadow-shadow-main">
                            Frequently asked questions
                        </h1>
                        <p className="text-muted-foreground capitalize text-sm p-2">
                            Questions you might have about our Products and services
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <FAQ question="Are there any subscription fees?" answer="No, our service is completely free for all users." />
                        <FAQ question="How do I reset my password?" answer="You can reset your password by clicking on the 'Forgot Password' link on the login page." />
                        <FAQ question="What is two-factor authentication?" answer="Two-factor authentication adds an extra layer of security by requiring a second form of verification in addition to your password." />
                        <FAQ question="Can I change my email address?" answer="Yes, you can change your email address in the account settings section." />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SupportTab() {
    return (
        <Suspense
            fallback={
                <div className="flex gap-5 h-full p-4 bg-card rounded-[10px] shadow-md">
                    <Skeleton className="h-80 w-[50%] rounded-lg" />
                    <div className="flex flex-col gap-6 w-[50%] p-6">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                        <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                </div>
            }
        >
            <SupportTabContent />
        </Suspense>
    );
}
