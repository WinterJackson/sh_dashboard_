// src/components/hospitals/HospitalsTable.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Hospital } from "@/lib/definitions";
import Image from 'next/image';
import SHlogo from "../../../public/images/shlogo.png";

interface HospitalsTableProps {
    hospitals: Hospital[];
    totalHospitals: number;
    currentPage: number;
}

const HospitalsTable: React.FC<HospitalsTableProps> = ({ hospitals, totalHospitals, currentPage }) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000);
    }, []);

    const handleRowClick = (hospitalId: number) => {
        router.push(`/dashboard/hospitals/${hospitalId}`);
    };

    return (
        <div className="flex flex-col min-w-full">
            <table className="min-w-full sm:w-full border-collapse divide-y divide-gray-200 mt-2">
                <thead className="bg-bluelight/5 p-3 rounded-t-2xl">
                    <tr>
                        <th
                            scope="col"
                            className="px-4 py-4 text-left text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Logo
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-4 text-center text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-4 text-center text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Id
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-4 text-center text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Phone
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-4 text-center text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Country
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-4 text-center text-sm font-bold text-black uppercase tracking-wider"
                        >
                            City
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-4 text-center text-sm font-bold text-black uppercase tracking-wider whitespace-nowrap"
                        >
                            Referral Code
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y-8 divide-slate-100 h-full">
                    {isLoading
                        ? Array.from({ length: 5 }).map((_, index) => (
                              <tr key={index}>
                                  <td colSpan={7}>
                                      <Skeleton className="h-[45px] w-full p-4 rounded-sm py-4" />
                                  </td>
                              </tr>
                          ))
                        : hospitals.map((hospital) => (
                              <tr
                                  key={hospital.hospitalId}
                                  className="cursor-pointer hover:bg-gray-100"
                                  onClick={() =>
                                      handleRowClick(hospital.hospitalId)
                                  }
                              >
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                                      <Image src={SHlogo} alt="Hospital logo" width={150} height={150} />

                                  </td>
                                  <td className="px-4 py-2 text-sm text-black">
                                      {hospital.hospitalName}
                                  </td>
                                  <td className="px-4 py-2 text-center whitespace-nowrap text-sm text-black">
                                      {hospital.hospitalId}
                                  </td>
                                  <td className="px-4 py-2 text-center whitespace-nowrap text-sm text-black">
                                      {hospital.phone}
                                  </td>
                                  <td className="px-4 py-2 text-center whitespace-nowrap text-sm text-black">
                                      {hospital.county}
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-black">
                                      {hospital.town}
                                  </td>
                                  <td className="px-4 py-2 text-center whitespace-nowrap text-sm text-black">
                                      {hospital.referralCode}
                                  </td>
                              </tr>
                          ))}
                </tbody>
            </table>
            {/* Add pagination controls here if needed */}
        </div>
    );
};

export default HospitalsTable;
