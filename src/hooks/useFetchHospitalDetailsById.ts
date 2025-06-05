// src/hooks/useFetchHospitalDetailsById.ts

import { useQuery } from "@tanstack/react-query";
import { Hospital } from "@/lib/definitions";

// // Fetch hospital data from the API route
// async function getHospitalDetails(hospitalId: number): Promise<Hospital> {
//     const res = await fetch(`/api/hospitals/${hospitalId}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         cache: "no-store",
//     });
//     if (!res.ok) {
//         const body = await res.json().catch(() => ({}));
//         throw new Error(
//             body.error || `Failed to fetch hospital (${res.status})`
//         );
//     }
//     return res.json();
// }

// // Hook to retrieve hospital details by ID
// export function useFetchHospitalDetailsById(hospitalId: number) {
//     return useQuery<Hospital, Error>({
//         queryKey: ["hospitalDetails", hospitalId],
//         queryFn: () => getHospitalDetails(hospitalId),
//         enabled: hospitalId > 0,
//         staleTime: 5 * 60 * 1000,
//     });
// }
