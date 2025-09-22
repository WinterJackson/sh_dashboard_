// src/components/doctors/ui/DoctorBio.tsx

"use client";

import React, { useState } from "react";
import PercentageBar from "./PercentageBar";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import { useFetchDoctorDetails } from "@/hooks/useFetchDoctorDetails";
import { Role } from "@/lib/definitions";
import { Rating } from "@mui/material";
import { Skeleton } from "@/components/ui/skeleton";

interface DoctorBioProps {
    doctorId: number;
    role: Role;
    hospitalId: number | null;
    cancel: () => void;
}

function DoctorBio({ doctorId, role, hospitalId, cancel }: DoctorBioProps) {
    const [slide, setSlide] = useState("0");

    // Construct user
    const user = { role, hospitalId };

    // Fetch doctor details
    const {
        data: doctor,
        isLoading,
        error,
    } = useFetchDoctorDetails(doctorId, user);

    // Calculate rating distribution
    const ratingDistribution: Record<number, number> = {
        5: doctor?.reviews?.filter((review) => review.rating === 5).length || 0,
        4: doctor?.reviews?.filter((review) => review.rating === 4).length || 0,
        3: doctor?.reviews?.filter((review) => review.rating === 3).length || 0,
        2: doctor?.reviews?.filter((review) => review.rating === 2).length || 0,
        1: doctor?.reviews?.filter((review) => review.rating === 1).length || 0,
    };

    const totalReviews = doctor?.reviews?.length || 0;
    const averageRating =
        totalReviews > 0
            ? (ratingDistribution[5] * 5 +
                  ratingDistribution[4] * 4 +
                  ratingDistribution[3] * 3 +
                  ratingDistribution[2] * 2 +
                  ratingDistribution[1] * 1) /
              totalReviews
            : 0;

    const skillsList: string[] = React.useMemo(() => {
        const skills = doctor?.skills;
        if (Array.isArray(skills)) {
            return skills;
        }
        if (typeof skills === "string") {
            return skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
        }
        return [];
    }, [doctor?.skills]);

    return (
        <div className="absolute top-0 left-0 z-30 flex justify-center items-center h-full w-screen">
            <div className="relative flex flex-col gap-8 p-6 bg-background opacity-100 lg:w-fit rounded-2xl h-full lg:max-h-[800px] overflow-y-scroll scrollbar-custom w-full lg:max-w-[1000px]">
                <div
                    className="absolute rounded-[5px] top-4 right-4 p-1 bg-slate hover:bg-primary hover:text-primary-foreground"
                    onClick={cancel}
                >
                    <CloseIcon />
                </div>

                <div className="flex gap-6 flex-wrap justify-center lg:justify-start">
                    {/* Profile bio */}
                    <div className="flex flex-1 flex-col gap-7 items-center w-[500px] bg-slate p-2 py-4 rounded-[10px]">
                        <div className="flex gap-5 items-center">
                            <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                                {isLoading ? (
                                    <Skeleton className="w-full h-full" />
                                ) : (
                                    <Image
                                        src={
                                            doctor?.user?.profile?.imageUrl ||
                                            "/images/img-p3.png"
                                        }
                                        alt={`${doctor?.user?.profile?.firstName} ${doctor?.user?.profile?.lastName}`}
                                        width={150}
                                        height={150}
                                        className="w-full h-full object-cover rounded-full border-4 border-primary m-2"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-4">
                                {isLoading ? (
                                    <>
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-40" />
                                    </>
                                ) : (
                                    <>
                                        <h1 className="font-semibold text-lg capitalize">
                                            Dr.{" "}
                                            {doctor?.user?.profile?.firstName}{" "}
                                            {doctor?.user?.profile?.lastName}
                                        </h1>
                                        <div className="flex flex-col gap-0">
                                            <h1 className="text-lg capitalize">
                                                {doctor?.specialization?.name}
                                            </h1>
                                            <div className="flex flex-col gap-2">
                                                <div>
                                                    <p className="text-muted-foreground text-lg capitalize">
                                                        {
                                                            doctor?.department
                                                                ?.name
                                                        }
                                                    </p>
                                                    <p className="capitalize">
                                                        Joined{" "}
                                                        {doctor?.createdAt
                                                            ? new Date(
                                                                  doctor.createdAt
                                                              ).toLocaleDateString()
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                                <p className="capitalize text-sm text-primary">
                                                    {
                                                        doctor?.hospital
                                                            ?.hospitalName
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* bio */}
                        <div className="flex flex-col gap-6 min-w-[360px] max-w-[400px]">
                            <div className="flex justify-between gap-2 min-w-[360px] max-w-[400px]">
                                {[
                                    "Biography",
                                    "Skills",
                                    "Contact Information",
                                ].map((tab, index) => (
                                    <div
                                        key={tab}
                                        className={`flex w-1/3 justify-center font-bold py-3 border-b-2 ${
                                            slide === String(index * 400)
                                                ? "border-primary text-primary"
                                                : "border-border text-muted-foreground"
                                        }`}
                                        onClick={() =>
                                            setSlide(String(index * 400))
                                        }
                                    >
                                        <p>{tab}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="overflow-hidden">
                                <div
                                    className="flex gap-0 transition-transform duration-800"
                                    style={{
                                        transform: `translateX(-${slide}px)`,
                                        transition:
                                            "transform 0.3s ease-in-out",
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-[400px] flex-shrink-0">
                                                <Skeleton className="h-24 w-full" />
                                            </div>
                                            <div className="w-[400px] flex-shrink-0">
                                                <Skeleton className="h-24 w-full" />
                                            </div>
                                            <div className="w-[400px] flex-shrink-0">
                                                <Skeleton className="h-24 w-full" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-[400px] flex-shrink-0">
                                                <p>
                                                    {doctor?.bio ||
                                                        "No biography available."}
                                                </p>
                                            </div>
                                            <div className="w-[400px] flex-shrink-0">
                                                {isLoading ? (
                                                    <Skeleton className="h-24 w-full" />
                                                ) : (
                                                    skillsList.map(
                                                        (skill, index) => (
                                                            <p
                                                                key={index}
                                                                className="font-medium capitalize"
                                                            >
                                                                {skill}
                                                            </p>
                                                        )
                                                    )
                                                )}
                                            </div>
                                            <div className="w-[400px] flex-shrink-0">
                                                <p className="flex gap-10">
                                                    <span className="font-bold text-primary">
                                                        Email :
                                                    </span>
                                                    <span className="text-foreground">
                                                        {doctor?.user?.email ||
                                                            "N/A"}
                                                    </span>
                                                </p>
                                                <p className="flex gap-10">
                                                    <span className="font-bold text-primary">
                                                        Phone Number :
                                                    </span>
                                                    <span className="text-foreground">
                                                        {doctor?.user?.profile
                                                            ?.phoneNo || "N/A"}
                                                    </span>
                                                </p>
                                                <p className="flex gap-10">
                                                    <span className="font-bold text-primary">
                                                        Address :
                                                    </span>
                                                    <span className="text-foreground">
                                                        {doctor?.user?.profile
                                                            ?.address || "N/A"}
                                                    </span>
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Patient reviews */}
                    <div className="flex flex-1 flex-col gap-5 w-[500px] items-center lg:items-start">
                        <h1 className="font-semibold">Patient Reviews</h1>
                        <div className="flex flex-col gap-2 w-full items-center lg:items-start">
                            {isLoading ? (
                                <Skeleton className="h-16 w-full" />
                            ) : (
                                <div className="flex justify-between gap-10 max-w-[400px] w-full bg-slate items-center p-3 rounded-2xl">
                                    <div className="flex gap-2">
                                        <Rating
                                            value={averageRating}
                                            precision={0.1}
                                            readOnly
                                        />
                                    </div>
                                    <div>
                                        <p>{averageRating.toFixed(1)} / 5.0</p>
                                    </div>
                                </div>
                            )}
                            {isLoading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                <p>{totalReviews} patients rating</p>
                            )}
                        </div>

                        <div className="flex flex-col max-w-[400px] gap-4 flex-1 w-full bg-slate p-4 rounded-[10px]">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const ratingCount = ratingDistribution[rating];
                                const ratingPercentage =
                                    totalReviews > 0
                                        ? (
                                              (ratingCount / totalReviews) *
                                              100
                                          ).toFixed(0)
                                        : "0";

                                return (
                                    <div
                                        key={rating}
                                        className="flex justify-between gap-2 items-center"
                                    >
                                        {isLoading ? (
                                            <Skeleton className="h-4 w-12" />
                                        ) : (
                                            <h2 className="font-bold w-[50px]">
                                                {rating} star
                                            </h2>
                                        )}
                                        {isLoading ? (
                                            <Skeleton className="h-4 w-full" />
                                        ) : (
                                            <PercentageBar
                                                percentage={`${ratingPercentage}%`}
                                            />
                                        )}
                                        {isLoading ? (
                                            <Skeleton className="h-4 w-8" />
                                        ) : (
                                            <span className="text-muted-foreground">
                                                {ratingPercentage}%
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Licenses */}
                <div className="flex flex-col">
                    <h1 className="font-semibold mb-6">Licenses</h1>
                    <div className="flex flex-wrap gap-4 justify-center bg-slate p-4 rounded-[10px]">
                        {isLoading ? (
                            <>
                                <Skeleton className="h-32 w-full max-w-[430px] min-w-[380px]" />
                                <Skeleton className="h-32 w-full max-w-[430px] min-w-[380px]" />
                            </>
                        ) : (
                            doctor?.licenses?.map((license) => (
                                <div
                                    key={license.licenseId}
                                    className="flex flex-1 gap-5 items-center max-w-[430px] min-w-[380px] border border-border p-4 rounded-xl"
                                >
                                    <Image
                                        src="/images/document.svg"
                                        alt="Document icon"
                                        width={24}
                                        height={24}
                                    />
                                    <div className="flex flex-col gap-2 flex-1">
                                        <h2 className="font-semibold capitalize">
                                            {license.name}
                                        </h2>
                                        <PercentageBar percentage={"100%"} />
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col gap-1">
                                                <h2>Expiry Date</h2>
                                                <span className="text-muted-foreground">
                                                    {new Date(
                                                        license.expiryDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <button className="bg-primary text-white px-6 py-2 rounded-2xl">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorBio;
