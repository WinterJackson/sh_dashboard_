// src/components/dashboard/ui/OutwardReferralsCard.tsx

"use client";

import React from "react";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from "@radix-ui/react-icons";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface OutwardReferralsCardProps {
    outwardReferralsToday: number;
    percentageChange: number | null;
    patientDelta: number;
}

const OutwardReferralsCard: React.FC<OutwardReferralsCardProps> = ({
    outwardReferralsToday,
    percentageChange,
    patientDelta,
}) => {
    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 3)
            return "text-2xl sm:text-4xl md:text-5xl xl:text-6xl";
        else if (numDigits <= 4)
            return "text-xl sm:text-3xl md:text-4xl xl:text-5xl";
        else if (numDigits <= 5)
            return "text-lg sm:text-2xl md:text-3xl xl:text-4xl";
        else if (numDigits <= 6)
            return "text-base sm:text-xl md:text-2xl xl:text-3xl";
        return "text-sm sm:text-base md:text-xl xl:text-2xl";
    };

    const patientChangeText =
        percentageChange === null
            ? "No data from previous week."
            : patientDelta > 0
            ? `Increased by ${patientDelta} patient(s) this week.`
            : patientDelta < 0
            ? `Decreased by ${Math.abs(patientDelta)} patient(s) this week.`
            : "No change in patient referrals this week.";

    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#0485D8] to-[#04D7E1] shadow-md shadow-gray-300 p-4 cursor-pointer">
            <div className="flex items-center gap-1 mb-10 pb-10">
                <h3 className="text-xs sm:text-sm md:text-sm lg:text-base text-[#9afaff] font-semibold">
                    Outward Referrals
                </h3>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className="ml-1">
                            <Info size={14} className="text-white" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                Total referrals sent today. Weekly change shown
                                as a percentage.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex items-center mb-14 pt-8 p-1 cursor-pointer">
                <div className="flex items-center text-white bg-black/20 rounded-[20px] border-[3px] border-solid border-[#04D7E1]">
                    {percentageChange !== null && percentageChange > 0 && (
                        <ArrowTopRightIcon />
                    )}
                    {percentageChange !== null && percentageChange < 0 && (
                        <ArrowBottomRightIcon />
                    )}
                    <span className="text-base sm:text-lg md:text-xl xl:text-2xl p-2">
                        {percentageChange !== null
                            ? `${percentageChange.toFixed(2)}%`
                            : "0.00%"}
                    </span>
                </div>
            </div>

            <div className="mb-4 p-2 cursor-pointer">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span
                                className={`font-bold text-white ${getFontSizeClass(
                                    outwardReferralsToday.toString().length
                                )}`}
                            >
                                {outwardReferralsToday}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {outwardReferralsToday} outward referral(s)
                                today.
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <p className="font-semibold text-[10px] sm:text-xs md:text-sm xl:text-lg text-white pt-5 whitespace-pre-line">
                {patientChangeText}
            </p>
        </div>
    );
};

export default OutwardReferralsCard;
