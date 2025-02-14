// src/app/components/settings/FAQs/FAQ.tsx

"use client";

import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type Props = {
    question: string;
    answer: string;
};

function FAQ({ question, answer }: Props) {
    const [isExtended, setIsExtended] = useState(false);
    return (
        <div
            className={`flex flex-col px-6 py-3 transition-transform duration-700 gap-7 ${
                isExtended
                    ? "border border-bluelight rounded-2xl "
                    : "border-b border-bluelight h-[50px] overflow-y-hidden"
            } `}
        >
            {/* Question */}
            <div className="flex justify-between items-center">
                <h1 className="font-bold capitalize max-w-[70%] text-nowrap">{question}</h1>
                <button
                    onClick={() => setIsExtended(!isExtended)}
                    className="text-primary"
                >
                    {isExtended ? <RemoveIcon /> : <AddIcon />}
                </button>
            </div>
            <p className="max-w-full text-md bg-white p-2 rounded-[10px] shadow-sm shadow-gray-400">{answer}</p>
        </div>
    );
}

export default FAQ;