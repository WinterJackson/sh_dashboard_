// src/components/hospitals/HospitalsTable.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Hospital } from "@/lib/definitions";

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
                <thead className="bg-bluelight">
                    <tr>
                        <th
                            scope="col"
                            className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Logo
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Name
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Id
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Phone
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Country
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider"
                        >
                            City
                        </th>
                        <th
                            scope="col"
                            className="px-4 py-5 text-left text-sm font-bold text-black uppercase tracking-wider"
                        >
                            Referral Code
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading
                        ? Array.from({ length: 10 }).map((_, index) => (
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
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <img
                                          src={hospital.logoUrl}
                                          alt={`${hospital.name} Logo`}
                                          className="h-10 w-10"
                                      />
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {hospital.name}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {hospital.hospitalId}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {hospital.phone}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {hospital.country}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {hospital.city}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
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
