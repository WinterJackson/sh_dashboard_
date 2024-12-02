// src/app/(auth)/sign-in/page.tsx

import SignInForm from "@/components/form/SignInForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import logo from "../../../../public/images/logo.png";
import Image from "next/image";
import AuthLayout from "../layout";

export const dynamic = "force-dynamic";

const SignInPage = async () => {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }
    return (
        <AuthLayout>
            <div className="flex gap-10">
                <div className="flex items-center">
                    <div className="p-8 my-auto bg-secondary rounded-2xl ">
                        <Image
                            src={logo}
                            alt="Hospital Logo"
                            width={300}
                            height={300}
                            className="p-1"
                            priority
                        />
                    </div>
                </div>

                <div className="w-px h-auto bg-secondary"></div>

                <div className="p-10 bg-secondary items-center rounded-2xl w-[450px]">
                    <SignInForm />
                </div>
            </div>
        </AuthLayout>
    );
};

export default SignInPage;
