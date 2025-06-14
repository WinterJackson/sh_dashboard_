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
            <div className="flex gap-10">
                <div className="flex items-center">
                    <div className="p-8 my-auto bg-secondary rounded-2xl">
                        <img
                            src="/images/logo.png"
                            alt="Hospital Logo"
                            width={300}
                            height={200}
                            className="p-1 object-contain"
                            loading="lazy"
                        />
                    </div>
                </div>
                <div className="w-px h-auto bg-secondary"></div>
                <div className="p-10 bg-secondary items-center rounded-2xl w-[450px]">
                    <SignUpForm />
                </div>
            </div>
        </AuthLayout>
    );
};

export default SignUpPage;
