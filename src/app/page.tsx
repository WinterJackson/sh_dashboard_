// src/app/page.tsx file

import Link from "next/link";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-row justify-center items-center bg-gray-100">
            <div className="bg-secondary flex items-center justify-center"></div>
            <div className="flex flex-col justify-center items-center">
                <div className="p-10 bg-secondary rounded-2xl">
                    <img
                        src="/images/logo.png"
                        alt="Hospital Logo"
                        width={500}
                        height={200}
                        className="p-1 object-contain"
                        loading="lazy"
                    />
                </div>
                <div className="mt-8 flex flex-row justify-center space-x-4">
                    <Link href="/sign-in">
                        <button className="bg-secondary text-white py-2 px-20 rounded hover:bg-primary">
                            Sign In
                        </button>
                    </Link>
                    <div className="w-px h-20 bg-secondary"></div>
                    <Link href="/sign-up">
                        <button className="bg-secondary text-white py-2 px-20 rounded hover:bg-primary">
                            Register
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
