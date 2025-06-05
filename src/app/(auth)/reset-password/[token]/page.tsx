// file: src/app/(auth)/reset-password/[token]/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import AuthLayout from "../../layout";
import ResetPasswordForm from "@/components/form/ResetPasswordForm";

const ResetPasswordPage = async () => {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect("/dashboard");
    }

    return (
        <AuthLayout>
            <div className="flex gap-10">
                <div className="flex items-center">
                    <div className="p-8 my-auto bg-secondary rounded-2xl ">
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

                <div className="p-10 bg-secondary items-center rounded-2xl w-[450px]">
                    <p className="text-white font-semibold mb-4 px-1 bg-primary w-[45%] py-2 rounded-[10px]">
                        Set/Reset Password
                    </p>
                    <ResetPasswordForm />
                </div>
            </div>
        </AuthLayout>
    );
};

export default ResetPasswordPage;
