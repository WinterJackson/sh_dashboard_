// src/app/components/settings/toogle button/Toogle.tsx

"use client";

import { useState } from "react";
import Image from "next/image";

const Toggle = () => {
    const [isFirstImage, setIsFirstImage] = useState(true);

    return (
        <div className="flex  flex-1 h30px items-center  justify-between">
            {/* First Image */}
            <div
                className="relative flex h-full  "
                onClick={() => setIsFirstImage(!isFirstImage)}
            >
                <Image
                    src="/images/Property 1=off.svg"
                    alt="First"
                    width={30}
                    height={30}
                    className={`object-cover transition-opacity duration-500 ${
                        isFirstImage ? "opacity-100" : "opacity-0"
                    }`}
                />
                {/* Second Image */}
                <Image
                    src="/images/Property 1=on.svg"
                    alt="Second"
                    width={30}
                    height={30}
                    className={`absolute object-cover transition-opacity duration-500 ${
                        isFirstImage ? "opacity-0" : "opacity-100"
                    }`}
                />
            </div>
        </div>
    );
};

export default Toggle;
