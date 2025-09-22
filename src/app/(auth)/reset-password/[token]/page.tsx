// src/app/(auth)/reset-password/[token]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AuthLayout from "../../layout";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";
import Image from "next/image";

const ResetPasswordPage = async () => {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return (
        <AuthLayout>
            <div className="flex flex-col sm:flex-row justify-center items-center px-4 py-8 w-full max-w-screen-xl min-h-screen">
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
                    <p className="text-white font-semibold mb-4 px-1 bg-primary w-[60%] py-2 rounded-[10px]">
                        Set/Reset Password
                    </p>
                    <ResetPasswordForm />
                </div>
            </div>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
