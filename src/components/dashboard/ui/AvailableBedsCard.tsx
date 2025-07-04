// src/components/dashboard/ui/AvailableBedsCard.tsx

"use client";

import React from "react";
import Image from "next/image";
import bedIcon from "../../../../public/images/bed.svg";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface AvailableBedsCardProps {
    availableBedsCount: number;
}

const AvailableBedsCard: React.FC<AvailableBedsCardProps> = ({
    availableBedsCount,
}) => {
    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 4)
            return "text-2xl sm:text-3xl md:text-4xl xl:text-5xl";
        if (numDigits <= 5)
            return "text-xl sm:text-2xl md:text-3xl xl:text-5xl";
        if (numDigits <= 6) return "text-lg sm:text-xl md:text-2xl xl:text-4xl";
        if (numDigits <= 7)
            return "text-base sm:text-lg md:text-xl xl:text-4xl";
        if (numDigits <= 8)
            return "text-sm sm:text-base md:text-lg xl:text-4xl";
        return "text-sm sm:text-base";
    };

    return (
        <div className="grid p-4 rounded-2xl bg-card shadow-md shadow-shadow-main cursor-pointer">
            <div className="flex items-center gap-1">
                <h3 className="text-xs sm:text-sm md:text-sm lg:text-base font-semibold mb-6 text-nowrap">
                    Available Beds
                </h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1 mb-6">
                            <Info size={14} className="text-text-muted" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                This shows the number of unoccupied beds
                                currently available for new patients.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center justify-between gap-6">
                <div>
                    <span
                        className={`font-bold p-1 rounded-[10px] bg-slate-two text-foreground ${getFontSizeClass(
                            availableBedsCount.toString().length
                        )}`}
                    >
                        {availableBedsCount}
                    </span>
                </div>
                <div className="flex w-1/3 items-center justify-end h-3/4 relative">
                    <Image
                        src={bedIcon}
                        alt="bed icon"
                        className="p-2 rounded-full bg-primary/40"
                        width={100}
                        height={100}
                    />
                </div>
            </div>

            <div className="flex mt-5 items-center justify-between">
                <p className="text-xs sm:text-sm">Today</p>
                <p className="p-1 rounded-[5px] text-xs sm:text-sm text-primary hover:bg-primary hover:text-primary-foreground">
                    View all
                </p>
            </div>
        </div>
    );
};

export default AvailableBedsCard;
