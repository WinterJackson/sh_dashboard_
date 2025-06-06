// src/app/(auth)/verify-token/page.tsx

import AuthLayout from "../../layout";
import VerifyTokenForm from "@/components/form/VerifyTokenForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Session } from "next-auth";

export default async function VerifyTokenPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // Get session
    const session: Session | null = await getServerSession(authOptions);

    // Redirect if no session or user
    if (!session || !session.user) {
        redirect("/sign-in");
    }

    // Check if MFA was already verified
    const cookieStore = cookies();
    const mfaVerified = cookieStore.get("mfaVerified")?.value === "true";

    // Extract callback URL or fallback to /dashboard
    const rawCallback = Array.isArray(searchParams.callbackUrl)
        ? searchParams.callbackUrl[0]
        : searchParams.callbackUrl;
    const callbackUrl =
        rawCallback && typeof rawCallback === "string"
            ? decodeURIComponent(rawCallback)
            : "/dashboard";

    // Redirect if MFA already verified
    if (session.user.twoFactorEnabled && mfaVerified) {
        redirect(callbackUrl);
    }

    // Render 2FA form
    return (
        <AuthLayout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex gap-10">
                    <div className="flex items-center">
                        <div className="p-8 my-auto bg-secondary rounded-2xl">
                            <img
                                src="/images/logo.png"
                                alt="Hospital Logo"
                                width={500}
                                height={200}
                                className="p-1 object-contain"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="w-px h-auto bg-secondary"></div>

                    <div className="p-10 w-full max-w-md bg-secondary rounded-[20px]">
                        <p className="text-white font-semibold pl-4 bg-primary w-[60%] py-2 mb-6 rounded-[5px]">
                            2FA Verification
                        </p>
                        <VerifyTokenForm callbackUrl={callbackUrl} />
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
