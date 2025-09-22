// src/app/page.tsx file

import Link from "next/link";
import Image from "next/image";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row justify-center items-center px-4 py-8">
            <div className="flex flex-col justify-center items-center w-full max-w-md">
                <div className="p-6 sm:p-8 md:p-10 bg-secondary rounded-2xl w-60 sm:w-full">
                    <Image
                        src="/images/logo.png"
                        alt="Hospital Logo"
                        width={500}
                        height={200}
                        className="p-1 object-contain max-w-full h-auto mx-auto"
                    />
                </div>
                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                    <Link href="/sign-in" className="w-full flex justify-center items-center sm:w-auto">
                        <button className="w-60 sm:w-auto bg-secondary text-white py-2 px-8 sm:px-16 md:px-20 rounded hover:bg-primary">
                            <span className="text-nowrap">
                                Sign In
                            </span>
                        </button>
                    </Link>
                    <Link href="/sign-up" className="w-full flex justify-center items-center sm:w-auto">
                        <button className="w-60 sm:w-auto bg-secondary text-white py-2 px-8 sm:px-16 md:px-20 rounded hover:bg-primary">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
