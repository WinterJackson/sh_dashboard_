// src/app/(auth)/sign-up/page.tsx

import SignUpForm from "@/components/form/SignUpForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AuthLayout from "../layout";

const SignUpPage = async () => {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return (
        <AuthLayout>
            <div className="flex flex-col sm:justify-center md:flex-row md:justify-center items-center px-4 py-8 w-full max-w-screen-xl">
                <div className="hidden md:flex items-center justify-center mb-6 md:mb-0 md:mr-10">
                    <div className="p-6 sm:p-8 md:p-10 bg-secondary rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-xs">
                        <img
                            src="/images/logo.png"
                            alt="Hospital Logo"
                            width={300}
                            height={200}
                            className="p-1 object-contain max-w-full h-auto mx-auto"
                            loading="lazy"
                        />
                    </div>
                </div>

                <div className="p-6 sm:p-8 md:p-10 bg-secondary rounded-2xl w-full max-w-sm sm:max-w-md md:max-w-md">
                    <SignUpForm />
                </div>
            </div>
        </AuthLayout>
    );
};

export default SignUpPage;
