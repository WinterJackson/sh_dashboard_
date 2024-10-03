// File: src/components/dashboard/TopDoctorsCard.tsx

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Rating } from "@mui/material";
import { useSessionData } from "@/hooks/useSessionData";
import { fetchAllDoctors } from "@/lib/data";
import { Doctor } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";

const TopDoctorsCard: React.FC = () => {
    const [topDoctors, setTopDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const sessionData = useSessionData();
    const { role, hospitalId } = sessionData?.user || {};

    // Fetch all doctors
    useEffect(() => {
        const fetchTopDoctors = async () => {
            try {
                const allDoctors = await fetchAllDoctors();
                let doctorsData: Doctor[] = [];

                if (role === "SUPER_ADMIN") {
                    doctorsData = allDoctors
                        .sort(
                            (
                                a: { averageRating: number },
                                b: { averageRating: number }
                            ) => b.averageRating - a.averageRating
                        )
                        .slice(0, 5);
                } else if (
                    hospitalId &&
                    role &&
                    ["ADMIN", "DOCTOR", "NURSE", "STAFF"].includes(role)
                ) {
                    doctorsData = allDoctors
                        .filter(
                            (doctor: { hospitalId: number }) =>
                                doctor.hospitalId === hospitalId
                        )
                        .sort(
                            (
                                a: { averageRating: number },
                                b: { averageRating: number }
                            ) => b.averageRating - a.averageRating
                        )
                        .slice(0, 5);
                }

                setTopDoctors(doctorsData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch top doctors:", error);
                setLoading(false);
            }
        };

        if (role) {
            fetchTopDoctors();
        }
    }, [role, hospitalId]);

    return (
        <div className="p-6 flex flex-col gap-4 shadow-lg shadow-gray-300 rounded-[20px] bg-slate-100 w-full mb-10">
            <h1 className="text-base font-semibold capitalize whitespace-nowrap">
                Top Doctors
            </h1>
            <div className="flex flex-col gap-5 w-full overflow-x-auto whitespace-nowrap py-3">
                {loading
                    ? Array.from({ length: 5 }).map((_, index) => (
                          <div key={index} className="flex gap-3">
                              <Skeleton className="w-[50px] h-[50px] rounded-full bg-gray-200" />
                              <div className="flex w-full items-center justify-between gap-4">
                                  <div className="flex-shrink-0 flex flex-col gap-2 min-w-[400px]">
                                      <Skeleton className="w-full h-[15px] bg-gray-200" />
                                      <Skeleton className="w-2/3 h-[15px] bg-gray-200" />
                                  </div>
                                  <div className="flex-shrink-0 flex flex-col gap-2 items-end min-w-[100px]">
                                      <Skeleton className="w-[80px] h-[15px] bg-gray-200" />
                                      <Skeleton className="w-[50px] h-[15px] bg-gray-200" />
                                  </div>
                              </div>
                          </div>
                      ))
                    : topDoctors.map((doctor) => (
                          <div key={doctor.doctorId} className="flex gap-3">
                              <Image
                                  src={
                                      doctor.user.profile?.imageUrl ||
                                      "/default-profile.png"
                                  }
                                  alt={`${doctor.user.profile?.firstName} ${doctor.user.profile?.lastName}`}
                                  width={50}
                                  height={50}
                                  className="object-cover rounded-full"
                              />
                              <div className="flex w-full items-center justify-between gap-4">
                                  <div className="flex-shrink-0 flex flex-col gap-2 min-w-[400px]">
                                      <h1 className="font-semibold text-base capitalize whitespace-nowrap">
                                          Dr. {doctor.user.profile?.firstName}{" "}
                                          {doctor.user.profile?.lastName}
                                      </h1>
                                      <p className="text-accent capitalize whitespace-nowrap">
                                          {doctor.specialization}
                                      </p>
                                  </div>
                                  <div className="flex-shrink-0 flex flex-col gap-2 items-end min-w-[100px]">
                                      <Rating
                                          value={doctor.averageRating}
                                          precision={0.1}
                                          readOnly
                                      />
                                      <p className="whitespace-nowrap">
                                          {doctor.averageRating.toFixed(1)} / 5
                                      </p>
                                  </div>
                              </div>
                          </div>
                      ))}
            </div>
        </div>
    );
};

export default TopDoctorsCard;
