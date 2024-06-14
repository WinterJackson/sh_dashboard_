import SignUpForm from "@/components/form/SignUpForm";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import logo from "../../../../public/images/logo.png";
import Image from "next/image";

const page = async () => {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect("/dashboard");
    }

    return (
        <div>
            <div className="p-10 my-10 bg-secondary rounded-2xl z-10">
                <Image src={logo} alt="Hospital Logo" width={300} height={20} />
            </div>
            <div className=" p-10 bg-secondary items-center rounded-2xl">
                <SignUpForm />
            </div>
        </div>
    );
};

export default page;
