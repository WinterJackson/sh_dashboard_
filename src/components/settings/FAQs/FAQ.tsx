// src/components/settings/FAQs/FAQ.tsx

"use client";

import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

type Props = {
    question: string;
    answer: string;
};

const FAQ = React.memo(function FAQ({ question, answer }: Props) {
    const [isExtended, setIsExtended] = useState(false);
    return (
        <div
            className={`flex flex-col px-4 py-3 transition-all duration-500 gap-4 ${
                isExtended
                    ? "bg-slate rounded-lg"
                    : "border-b border-border h-[50px] overflow-y-hidden"
            }`}
        >
            {/* Question */}
            <div className="flex justify-between items-center">
                <h1 className="font-semibold capitalize">{question}</h1>
                <button
                    onClick={() => setIsExtended(!isExtended)}
                    className="text-primary"
                >
                    {isExtended ? <RemoveIcon /> : <AddIcon />}
                </button>
            </div>
            <p className="max-w-full text-sm text-muted-foreground bg-background p-2 rounded-md shadow-sm">{answer}</p>
        </div>
    );
});

FAQ.displayName = 'FAQ';

export default FAQ;