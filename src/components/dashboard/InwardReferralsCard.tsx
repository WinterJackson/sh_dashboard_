// File: src/components/dashboard/InwardReferralsCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import { fetchAllReferrals } from "@/lib/data";
import { useUser } from "@/app/context/UserContext";
import { ArrowTopRightIcon, ArrowBottomRightIcon } from "@radix-ui/react-icons";

const InwardReferralsCard = () => {
    const { user, hospitalId } = useUser();
    const [inwardReferrals, setInwardReferrals] = useState(0);
    const [percentageChange, setPercentageChange] = useState<number>(0);
    const [patientChangeText, setPatientChangeText] = useState<string>("");

    useEffect(() => {
        if (!user || !hospitalId) {
            return;
        }

        const fetchReferrals = async () => {
            const referrals = await fetchAllReferrals();

            let filteredReferrals = referrals;
            if (user?.role !== "SUPER_ADMIN" && hospitalId) {
                filteredReferrals = referrals.filter(
                    (referral: { hospitalId: number }) =>
                        referral.hospitalId === hospitalId
                );
            }

            const inwardReferrals = filteredReferrals.filter(
                (referral: { type: string }) => referral.type === "Internal"
            );

            setInwardReferrals(inwardReferrals.length);

            const today = new Date();
            const currentWeekReferrals: any[] = [];
            const previousWeekReferrals: any[] = [];

            inwardReferrals.forEach(
                (referral: { effectiveDate: string | number | Date }) => {
                    const date = new Date(referral.effectiveDate);
                    const diff =
                        (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
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
                    currentWeekReferrals.length - previousWeekReferrals.length;
                percentage =
                    (referralChange / previousWeekReferrals.length) * 100;
            }
            setPercentageChange(percentage);

            if (patientChange > 0) {
                setPatientChangeText(
                    `Increased In Data By ${patientChange} \nPatient(s) In The Last 7 Days.`
                );
            } else if (patientChange < 0) {
                setPatientChangeText(
                    `Decreased In Data By ${Math.abs(patientChange)} \nPatient(s) In The Last 7 Days.`
                );
            } else {
                setPatientChangeText(
                    "No Change In Patient Referrals \nIn The Last 7 Days!"
                );
            }
        };

        fetchReferrals();
    }, [user, hospitalId]);

    const getFontSizeClass = (numDigits: number) => {
        if (numDigits <= 3) return "text-4xl xl:text-6xl";
        else if (numDigits <= 4) return "text-3xl xl:text-5xl";
        else if (numDigits <= 5) return "text-2xl xl:text-4xl";
        else if (numDigits <= 6) return "text-xl xl:text-3xl";
        else return "text-base xl:text-2xl";
    };

    return (
        <div className="rounded-2xl bg-gradient-to-br from-[#0485D8] to-[#04D7E1] shadow-lg shadow-gray-300 p-4">
            <h3 className="text-sm xl:text-base text-[#9afaff] font-semibold mb-10 pb-12">
                Inward Referrals
            </h3>

            <div className="flex items-center mb-10 pt-9 p-1">
                <div
                    className={`flex items-center text-white bg-black/20 ${
                        percentageChange < 0 ? "text-white" : ""
                    }`}
                    style={{
                        borderRadius: "2rem !important",
                        border: "3px solid #04D7E1",
                    }}
                >
                    {percentageChange > 0 && <ArrowTopRightIcon />}
                    {percentageChange < 0 && <ArrowBottomRightIcon />}
                    <span className="text-xl xl:text-2xl ml-2 p-2">
                        {percentageChange.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <span
                    className={`font-bold text-6xl ${getFontSizeClass(
                        inwardReferrals.toString().length
                    )} text-white`}
                >
                    1{inwardReferrals}6
                </span>
            </div>

            <p className="font-semibold text-xs xl:text-lg text-white pt-5 whitespace-pre-line">
                {patientChangeText}
            </p>
        </div>
    );
};

export default InwardReferralsCard;
