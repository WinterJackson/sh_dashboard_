// src/app/(auth)/dashboard/settings/support/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import FAQ from "@/components/settings/FAQs/FAQ";
import React from "react";
import Image from "next/image";

export default async function SupportPage() {
    // Fetch session data
    const session = await getServerSession(authOptions);

    // Redirect unauthenticated users to the sign-in page
    if (!session || !session.user) {
        redirect("/sign-in");
        return null;
    }

    return (
        <div className="flex gap-10 h-full">
            {/* left */}
            <div className="flex justify-center items-center h-full w-[50%]">
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
                        <h1 className="font-bold capitalize text-2xl">
                            Frequently asked questions{" "}
                        </h1>
                        <p className="text-primary capitalize">
                            Questions you might have about our Products and
                            services
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <FAQ />
                        <FAQ />
                    </div>
                </div>
            </div>
        </div>
    );
}
