// src/app/(auth)/verify-token/page.tsx

import AuthLayout from "../../layout";
import VerifyTokenForm from "@/components/form/VerifyTokenForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import type { Session } from "next-auth";

/**
 * VerifyTokenPage:
 * 1. Redirects to /sign-in if there is no valid session or no session.user.
 * 2. Reads the "mfaVerified" cookie to determine if 2FA has already been completed.
 * 3. Redirects to /dashboard only if session.user.twoFactorEnabled === true AND mfaVerified === true.
 * 4. Otherwise, renders the 2FA form.
 */
export default async function VerifyTokenPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    // 1) Get the NextAuth session
    const session: Session | null = await getServerSession(authOptions);

    // 2) If there’s no session or session.user is undefined, redirect to /sign-in
    if (!session || !session.user) {
        redirect("/sign-in");
    }

    // 3) Read the "mfaVerified" cookie (set by /api/auth/mfa/verify on successful TOTP)
    const cookieStore = cookies();
    const mfaVerified = cookieStore.get("mfaVerified")?.value === "true";

    // 4) Derive callbackUrl (or default to /dashboard)
    const rawCallback = Array.isArray(searchParams.callbackUrl)
        ? searchParams.callbackUrl[0]
        : searchParams.callbackUrl;
    const callbackUrl =
        rawCallback && typeof rawCallback === "string"
            ? decodeURIComponent(rawCallback)
            : "/dashboard";

    // 5) If MFA is already verified, send to the original callback
    if (session.user.twoFactorEnabled && mfaVerified) {
        redirect(callbackUrl);
    }

    // 5) Otherwise, render the 2FA form
    return (
        <AuthLayout>
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex gap-10">
                    <div className="flex items-center">
                        <div className="p-8 my-auto bg-secondary rounded-2xl">
                            <img
                                src="/images/logo.png"
                                alt="Hospital Logo"
                                width={300}
                                height={300}
                                className="p-1 object-contain"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    <div className="w-px h-auto bg-secondary"></div>

                    <div className="p-10 w-full max-w-md bg-secondary rounded-[20px]">
                        <p className="text-white font-semibold pl-4 bg-primary w-[60%] py-2 mb-6 rounded-[10px]">
                            2FA Verification
                        </p>
                        <VerifyTokenForm callbackUrl={callbackUrl} />
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
