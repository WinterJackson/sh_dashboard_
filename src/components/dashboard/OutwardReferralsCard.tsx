// File: src/components/dashboard/OutwardReferralsCard.tsx

"use client";

import { useSessionData } from "@/hooks/useSessionData";
import { fetchAllReferrals } from "@/lib/data";
import { ArrowBottomRightIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

const OutwardReferralsCard = () => {
    const sessionData = useSessionData();
    const role = sessionData?.user?.role;
    const [outwardReferrals, setOutwardReferrals] = useState(0);
    const [percentageChange, setPercentageChange] = useState<number>(0);
    const [patientChangeText, setPatientChangeText] = useState<string>("");

    useEffect(() => {
        const fetchReferrals = async () => {
            try {
                const referrals = await fetchAllReferrals();

                // Filter the referrals based on the role
                let filteredReferrals: any[] = [];

                if (referrals) {
                    filteredReferrals = referrals.filter(
                        (referral: { type: string }) =>
                            referral.type === "External"
                    );
                }

                if (role !== "SUPER_ADMIN") {
                    const hospitalId = sessionData?.user?.hospitalId;
                    filteredReferrals = filteredReferrals.filter(
                        (referral: { hospitalId: number }) =>
                            referral.hospitalId === hospitalId
                    );
                }

                setOutwardReferrals(filteredReferrals.length);

                // Separate referrals into current week and previous week
                const today = new Date();
                const currentWeekReferrals: any[] = [];
                const previousWeekReferrals: any[] = [];

                filteredReferrals.forEach(
                    (referral: { effectiveDate: string | number | Date }) => {
                        const date = new Date(referral.effectiveDate);
                        const diff =
                            (today.getTime() - date.getTime()) /
                            (1000 * 3600 * 24);
                        const dayIndex = Math.floor(diff);

                        if (dayIndex >= 0 && dayIndex < 7) {
                            currentWeekReferrals.push(referral);
                        } else if (dayIndex >= 7 && dayIndex < 14) {
                            previousWeekReferrals.push(referral);
                        }
                    }
                );

                const getUniquePatientCount = (referralsArray: any[]) => {
                    const uniquePatients = new Set();
                    referralsArray.forEach((referral) => {
                        uniquePatients.add(referral.patientId);
                    });
                    return uniquePatients.size;
                };

                const currentWeekPatientsCount =
                    getUniquePatientCount(currentWeekReferrals);
                const previousWeekPatientsCount = getUniquePatientCount(
                    previousWeekReferrals
                );

                const patientChange =
                    currentWeekPatientsCount - previousWeekPatientsCount;

                // Calculate percentage change
                let percentage = 0;
                if (
                    previousWeekReferrals.length === 0 &&
                    currentWeekReferrals.length > 0
                ) {
                    percentage = 100;
                } else if (
                    currentWeekReferrals.length === 0 &&
                    previousWeekReferrals.length > 0
                ) {
                    percentage = -100;
                } else if (previousWeekReferrals.length > 0) {
                    const referralChange =
                        currentWeekReferrals.length -
                        previousWeekReferrals.length;
                    percentage =
                        (referralChange / previousWeekReferrals.length) * 100;
                }

                setPercentageChange(percentage);

                // Set the text for patient change
                if (patientChange > 0) {
                    setPatientChangeText(
                        `Increased In Data By ${patientChange} \nPatient(s) In The Last 7 Days.`
                    );
                } else if (patientChange < 0) {
                    setPatientChangeText(
                        `Decreased In Data By ${Math.abs(
                            patientChange
                        )} \nPatient(s) In The Last 7 Days.`
                    );
                } else {
                    setPatientChangeText(
                        "No Change In Patient Referrals \nIn The Last 7 Days!"
                    );
                }
            } catch (error) {
                console.error("Error fetching referrals:", error);
            }
        };

        fetchReferrals();
    }, [role, sessionData]);

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
                        outwardReferrals.toString().length
                    )} text-white`}
                >
                    {outwardReferrals}
                </span>
            </div>

            <p className="font-semibold text-xs xl:text-lg text-white pt-5 whitespace-pre-line">
                {patientChangeText}
            </p>
        </div>
    );
};

export default OutwardReferralsCard;
