// src/app/(auth)/verify-token/page.tsx

import AuthLayout from "../../layout";
import VerifyTokenForm from "@/components/form/VerifyTokenForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Session } from "next-auth";
import Image from "next/image";

export default async function VerifyTokenPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session: Session | null = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const rawCallback = Array.isArray(searchParams.callbackUrl)
        ? searchParams.callbackUrl[0]
        : searchParams.callbackUrl;

    const callbackUrl =
        rawCallback && typeof rawCallback === "string"
            ? decodeURIComponent(rawCallback)
            : "/dashboard";

    const cookieStore = cookies();
    const mfaVerified = cookieStore.get("mfaVerified")?.value === "true";

    if (session.user.twoFactorEnabled && mfaVerified) {
        redirect(callbackUrl);
    }

    return (
        <AuthLayout>
            <div className="flex flex-col sm:flex-row justify-center items-center px-4 py-8 w-full max-w-screen-xl min-h-screen">
                {/* ✅ Only show logo on md+ */}
                <div className="hidden md:flex items-center justify-center mb-6 sm:mb-0 sm:mr-10 w-full max-w-sm sm:max-w-md md:max-w-xs">
                    <div className="p-6 sm:p-8 md:p-10 bg-secondary rounded-2xl w-full">
                        <Image
                            src="/images/logo.png"
                            alt="Hospital Logo"
                            width={300}
                            height={200}
                            className="p-1 object-contain max-w-full h-auto mx-auto"
                        />
                    </div>
                </div>

                <div className="p-6 sm:p-8 md:p-10 bg-secondary rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-md">
                    <p className="text-white text-xs sm:text-sm font-semibold pl-4 bg-primary w-[60%] py-2 mb-6 rounded-[5px]">
                        2FA Verification
                    </p>
                    <VerifyTokenForm callbackUrl={callbackUrl} />
                </div>
            </div>
        </AuthLayout>
    );
}
