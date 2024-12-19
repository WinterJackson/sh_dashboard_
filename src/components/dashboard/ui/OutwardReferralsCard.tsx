// File: src/components/dashboard/ui/OutwardReferralsCard.tsx

"use client";

import React, { useMemo } from "react";
import { ArrowBottomRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";

interface OutwardReferralsCardProps {
    outwardReferrals: {
        effectiveDate: Date;
        patientId: number;
    }[];
}

// Define the return type for useMemo
interface ReferralStats {
    currentWeekCount: number;
    previousWeekCount: number;
    percentageChange: number;
    patientChangeText: string;
}

const OutwardReferralsCard: React.FC<OutwardReferralsCardProps> = ({
    outwardReferrals,
}) => {
    // Memoize calculations to avoid unnecessary re-renders
    const {
        currentWeekCount,
        percentageChange,
        patientChangeText,
    }: ReferralStats = useMemo((): ReferralStats => {
        const today = new Date();

        // Separate current and previous week referrals
        const currentWeekReferrals = outwardReferrals.filter((referral) => {
            const diff =
                (today.getTime() - new Date(referral.effectiveDate).getTime()) /
                (1000 * 3600 * 24);
            return diff >= 0 && diff < 7; // Current week: 0-6 days ago
        });

        const previousWeekReferrals = outwardReferrals.filter((referral) => {
            const diff =
                (today.getTime() - new Date(referral.effectiveDate).getTime()) /
                (1000 * 3600 * 24);
            return diff >= 7 && diff < 14; // Previous week: 7-13 days ago
        });

        // Unique patient count for current and previous weeks
        const getUniquePatientCount = (referrals: { patientId: number }[]) => {
            const uniquePatients = new Set(
                referrals.map((ref) => ref.patientId)
            );
            return uniquePatients.size;
        };

        const currentPatientCount = getUniquePatientCount(currentWeekReferrals);
        const previousPatientCount = getUniquePatientCount(
            previousWeekReferrals
        );

        // Calculate percentage change
        const calculatedPercentageChange =
            previousPatientCount === 0
                ? currentPatientCount > 0
                    ? 100 // 100% increase if no referrals in previous week
                    : 0 // No change if no referrals in both weeks
                : ((currentPatientCount - previousPatientCount) /
                      previousPatientCount) *
                  100;

        // Generate patient change text
        const dynamicPatientChangeText =
            currentPatientCount > previousPatientCount
                ? `Increased by ${
                      currentPatientCount - previousPatientCount
                  } patient(s) this week.`
                : currentPatientCount < previousPatientCount
                ? `Decreased by ${
                      previousPatientCount - currentPatientCount
                  } patient(s) this week.`
                : "No change in patient referrals this week.";

        return {
            currentWeekCount: currentWeekReferrals.length,
            previousWeekCount: previousWeekReferrals.length,
            percentageChange: calculatedPercentageChange,
            patientChangeText: dynamicPatientChangeText,
        };
    }, [outwardReferrals]);

    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 3) return "text-4xl xl:text-6xl";
        else if (numDigits <= 4) return "text-3xl xl:text-5xl";
        else if (numDigits <= 5) return "text-2xl xl:text-4xl";
        else if (numDigits <= 6) return "text-xl xl:text-3xl";
        else return "text-base xl:text-2xl";
    };

    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#0485D8] to-[#04D7E1] shadow-lg shadow-gray-300 p-4">
            <h3 className="text-sm xl:text-base text-[#9afaff] font-semibold mb-10 pb-10">
                Outward Referrals
            </h3>

            <div className="flex items-center mb-14 pt-8 p-1">
                <div
                    className={`flex items-center text-white bg-black/20 ${
                        percentageChange < 0 ? "text-white" : ""
                    } rounded-[20px] border-[3px] border-solid border-[#04D7E1]`}
                >
                    {percentageChange > 0 && <ArrowTopRightIcon />}
                    {percentageChange < 0 && <ArrowBottomRightIcon />}
                    <span className="text-xl xl:text-2xl p-2">
                        {percentageChange.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <span
                    className={`font-bold text-6xl ${getFontSizeClass(
                        currentWeekCount.toString().length
                    )} text-white`}
                >
                    {currentWeekCount}
                </span>
            </div>

            <p className="font-semibold text-xs xl:text-lg text-white pt-5 whitespace-pre-line">
                {patientChangeText}
            </p>
        </div>
    );
};

export default OutwardReferralsCard;
