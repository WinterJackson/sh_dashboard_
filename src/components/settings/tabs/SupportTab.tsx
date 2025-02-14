// src/app/(auth)/dashboard/settings/tabs/SupportTab.tsx

"use client";

import FAQ from "@/components/settings/FAQs/FAQ";
import Image from "next/image";
// import { useSessionData } from "@/hooks/useSessionData";
// import { redirect } from "next/navigation";

function SupportTab() {
    // const session = useSessionData();

    // // Redirect unauthenticated users to the sign-in page
    // if (!session || !session.user) {
    //     redirect("/sign-in");
    //     return null;
    // }

    return (
        <div className="flex gap-5 h-full p-4">
            {/* left */}
            <div className="flex justify-center items-center h-full w-[50%] p-10 border-r-4">
                <Image
                    src="/images/amico.svg"
                    alt=""
                    width={500}
                    height={500}
                />
            </div>
            {/* right */}
            <div className="flex h-full w-[50%] pt-7">
                <div className="flex flex-col gap-7">
                    <div className="flex flex-col gap-4">
                        <h1 className="capitalize font-semibold bg-white p-2 rounded-[10px] shadow-sm shadow-gray-400">Frequently asked questions</h1>
                        <p className="text-primary capitalize text-sm p-2">Questions you might have about our Products and services</p>
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

export default SupportTab;